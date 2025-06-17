import { Bug, FileText, Users } from "lucide-react";
import React from "react";

interface FeatureItem {
  text: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  amount: number;
}

export const Analytics = () => {
  const features: Feature[] = [
    {
      icon: <FileText className="size-5 text-orange-400" />,
      title: "Total Lines",
      amount: 45672,
      description: "Across all files",
    },
    {
      icon: <Users className="size-5 text-orange-400" />,
      title: "Contributions",
      amount: 12,
      description: "Active developers",
    },
    {
      icon: <Bug className="size-5 text-orange-400" />,
      title: "Open Issues",
      amount: 23,
      description: "Needs attentions",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-5 pb-10">
      <div className="">
        <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-slate-700 bg-slate-800/50 p-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(15, 23, 42, 0) 50%), rgba(30, 41, 59, 0.5)",
              }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-gray-300">{feature.title}</h3>
              <div className="mt-6">
                <p className="mb-1 text-2xl font-bold">{feature.amount}</p>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
