"use client";

import MouseMovement from "@/components/mouse-movement";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features, platformTabs } from "@/lib/data";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setAciveTab] = useState(0);
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20 animate-pulse" />

      <MouseMovement />

      <section className="relative z-10 mt-48 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-7xl lg:text-8xl tracking-tight leading-none font-black">
                <span className="block font-black text-white">
                  Create.
                </span>
                <span className="block font-light text-purple-300 italic">
                  Publish.
                </span>
                <span className="block font-black bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Grow.
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl md:max-w-none">
                The AI platform that turns your ideas into{" "}
                <span className="text-purple-300 font-semibold">
                  engaging content
                </span>{" "}
                and helps you build a thriving creator business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:items-start ">
              <Link href={"/dashboard"}>
                <Button
                  size={"xl"}
                  variant={"primary"}
                  className={
                    "rounded-full w-full sm:w-auto text-white"
                  }
                >
                  Start Creating for Free
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href={"/feed"}>
                <Button
                  size={"xl"}
                  variant={"outline"}
                  className={"rounded-full w-full sm:w-auto"}
                >
                  Explore the Feed
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Image
              src={"/banner.png"}
              alt="Platform Banner"
              width={500}
              height={700}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>
      <section
        className="relative mt-14 z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/20"
        id="features"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
              <span className="gradient-text-primary">
                Everything you need
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              From AI-powered writing assistance to advanced
              analytics, we&apos;ve built the complete toolkit for
              modern creators
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((f, index) => (
              <Card
                key={index}
                className={
                  "group transition-all duration-300 hover:scale-105 card-glass"
                }
              >
                <CardContent>
                  <div
                    className={`w-12 h-12 sm:size-16 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <f.icon className="size-6 sm:size-8 text-white" />
                  </div>
                  <CardTitle
                    className={
                      "text-lg sm:text-xl mb-3 sm:mb-4 text-white"
                    }
                  >
                    {f.title}
                  </CardTitle>
                  <CardDescription
                    className={"text-sm sm:text-base text-gray-400"}
                  >
                    {f.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
            <span className="gradient-text-primary">
              How it works
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Three powerful modules working together to supercharge
            your content creation.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="space-y-4">
              {platformTabs.map((t, idx) => (
                <Button
                  key={idx}
                  variant={activeTab === idx ? "outline" : "ghost"}
                  className={"w-full justify-start h-auto p-6"}
                  onClick={() => setAciveTab(idx)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center ${
                        activeTab === idx
                          ? "bg-gradient-to-br from-purple-500 to-blue-500"
                          : "bg-gray-400/40"
                      }`}
                    >
                      <t.icon className="size-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{t.title}</h3>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          <div className="lg:w-2/3">
            <Card className={"bg-gray-900/50 border-gray-800"}>
              <CardHeader>
                <CardTitle className={"text-white"}>{platformTabs[activeTab].title}</CardTitle>
                <CardDescription>
                  {platformTabs[activeTab].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {platformTabs[activeTab].features.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="size-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
