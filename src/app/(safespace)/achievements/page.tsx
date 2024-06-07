"use client";

import AchievementCard from "@/components/Achievements/achievement-card";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { Achievement, AchievementData } from "@/util/achievement-data";
import { PersistUserService } from "@/services/user/PersistUserService";
import { ReturnAchievement } from "@/services/user/PersistUserServiceInterface";

export default function Achievements() {
  const [progress, setProgress] = useState(0.6);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const context = new PersistUserService();
      const userData = await context.getAchievement();
      const fetchedAchievements = AchievementData.achievements
        .map(
          (a) =>
            ({
              ...a,
              progress: getProgress(userData, a.id),
            }) as Achievement,
        )
        .sort((a, b) => {
          if (a.progress && !b.progress) {
            return -1; // Show achieved first
          } else if (b.progress && !a.progress) {
            return 1;
          } else {
            return 0;
          }
        });
      setAchievements(fetchedAchievements);
    };

    fetchData().then((r) => console.log(r));
  }, []);

  function getProgress(
    userData: ReturnAchievement[] | ReturnAchievement,
    achievementId: string,
  ) {
    if (!Array.isArray(userData)) {
      return false;
    }
    return (
      userData.find((u) => u.achievementEnum === achievementId)?.isAchieved ??
      false
    );
  }
  const steps = [
    {
      progress: 0.1,
      text: "Einstieg",
    },
    {
      progress: 0.8,
      text: "Master Quiz",
      icon: "star.svg",
    },
  ];
  return (
    <div className="px-8 overflow-y-auto h-full">
      <h1 className="text-sky-900 text-4xl font-extrabold mt-2 mb-2">
        Dein Fortschritt
      </h1>
      <div className="flex gap-4 pt-12 pb-8">
        <ProgressBar progress={progress} steps={steps} />
      </div>
      <h3 className="text-sky-background text-3xl font-bold text-sky-900 pb-8">
        Erfolge
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {achievements.map((a) => (
          <AchievementCard
            key={a.title}
            id={a.id}
            title={a.title}
            description={a.description}
            progress={a.progress}
          />
        ))}
      </div>
    </div>
  );
}
