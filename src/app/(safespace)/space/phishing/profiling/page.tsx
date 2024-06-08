"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import Button from '@/components/button';
import clsx from 'clsx';
import Image from 'next/image';

type Column = {
  id: string;
  items: string[];
};

const signsFakeProfile = [
  'kein Profilbild',
  'verschwommenes Profilbild',
  'kaum Follower',
  'Name von bekanntem Profil leicht abgeändert',
  'privates Profil einer bekannten Persönlichkeit',
  'Kaum Beiträge',
  'Kaum Kommentare',
  'Etwas gewonnen',
  'Links',
]

const signsRealProfile = [
  'Verifiziertes Profil',
  'viele Follower',
  'gleiche Person auf vielen Bildern zu sehen',
  'öffentliches Profil einer bekannten Persönlichkeit',
  'Viele Beiträge',
  'Viele Kommentare',
  'Regelmäßige Storys',
  'Videos mit Person zu sehen'
];

function shuffleArray(array: string[]) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function arraysEquals(arr1: string[], arr2: string[]) {
  console.log(arr1)
  console.log(arr2)
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

const initialColumns: { [key: string]: Column } = {
  wordsPool: { id: 'wordsPool', items: [] },
  fakeProfile: { id: 'fakeProfile', items: [] },
  realProfile: { id: 'realProfile', items: [] }
};

export default function Profiling() {
  const router = useRouter();
  const [columns, setColumns] = useState(initialColumns);
  const [instructionRead, setInstructionsRead] = useState(false);
  const [wrongAnmiation, setWrongAnimation] = useState(false);
  const [moduleFinished, setModuleFinished] = useState(false);

  useEffect(() => {
    const shuffledItems = shuffleArray(signsFakeProfile.concat(signsRealProfile));
    setColumns({
      ...initialColumns,
      wordsPool: { id: 'wordsPool', items: shuffledItems }
    });
  }, []);

  const handleFinish = () => {
    const isFinished = arraysEquals(columns.fakeProfile.items, signsFakeProfile) && arraysEquals(columns.realProfile.items, signsRealProfile)

    if (isFinished) {
      setModuleFinished(true)
    } else {
      setWrongAnimation(true)
      setTimeout(() => setWrongAnimation(false), 700)
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems }
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems }
      });
    }
  };

  return (
    <>
      {moduleFinished ? (
        <div className='flex flex-col items-center text-center gap-6 md:mt-6'>
          <span className='text-5xl text-blue-background'>Gut gemacht!</span>
          <Image
            src="/instagram-profile.png"
            alt="insta profile"
            width={150}
            height={150}
          />
          <span className='max-w-[600px]'> Du hast alle Anzeichen richtig zugeordnet. Als nächstes wird deine Aufgabe sein dein Wissen anzuwenden und Fake-Profile zu erkennen.</span>
          <Button onClick={() => router.push('/space/phishing/assign')}>
            Starten
          </Button>
        </div>
      ) : (
        <div>
          <DragDropContext
            onDragEnd={onDragEnd}
          >
            <div className="container">
              {columns.wordsPool.items.length != 0 && (<Droppable droppableId="wordsPool">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-2 flex flex-wrap gap-x-4 gap-y-2 mb-4"
                  >
                    {columns.wordsPool.items.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='p-2 text-blue-background bg-module-blue rounded-xl text-xs sm:text-sm lg:text-base'
                          >
                            {item}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>)}
              {instructionRead ? (
                <div>
                  <div className='flex justify-between'>
                    {Object.entries(columns).filter(([columnId]) => columnId !== 'wordsPool').map(([columnId, column]) => (
                      <Droppable key={columnId} droppableId={columnId}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className='w-[45%] min-h-[20vh]'
                          >
                            <h3 className='text-md lg:text-xl mb-1 text-blue-background font-medium'>{columnId === 'fakeProfile' ? 'Anzeichen für Fake Profile' : columnId === 'realProfile' ? "Anzeichen für echte Profile" : ""}</h3>
                            <div className='flex flex-col gap-2 py-2 px-4 border-gray-300 border-2 rounded-2xl min-h-[20vh]'>
                              {column.items.map((item, index) => (
                                <Draggable key={item} draggableId={item} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={clsx('p-2 bg-module-blue text-blue-background rounded-xl text-xs sm:text-sm lg:text-base', wrongAnmiation && "animate-shake text-white bg-red-500")}
                                    >
                                      {item}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                  {columns.wordsPool.items.length == 0 && (
                    <div>
                      <Button className='min-w-[150px] mt-2' onClick={() => handleFinish()}>
                        Überprüfen
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='p-2 flex flex-col gap-4 lg:mt-8'>
                  Ordne die oben aufgeführten Anzeichen den entsprechenden Kategorien zu: "Anzeichen für Fake Profile" oder "Anzeichen für Echte Profile". Ziehe die einzelnen Anzeichen aus dem Wörter-Pool und lege sie in die entsprechende Kategorie.

                  <Button onClick={() => setInstructionsRead(true)} className='max-w-[150px]'>
                    Starten
                  </Button>
                </div>
              )}
            </div>
          </DragDropContext>
        </div>
      )}
    </>
  );
}
