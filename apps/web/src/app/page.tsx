"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Users,
  BarChart3,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: Heart,
      title: "Create a Campaign",
      description:
        "Set up your fundraiser with a compelling story and clear goal",
    },
    {
      icon: Users,
      title: "Share Your Blink",
      description:
        "Distribute your campaign link across social media and networks",
    },
    {
      icon: TrendingUp,
      title: "Watch Donations Flow",
      description: "Track real-time donations directly to your Solana wallet",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant donations with Solana's sub-second confirmation times",
    },
    {
      icon: Shield,
      title: "Transparent & Secure",
      description: "All transactions are publicly verifiable on the blockchain",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept donations from anywhere in the world, 24/7",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track your campaign performance with live updates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="animate-pulse mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Powered by Solana
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Launch Fundraisers That{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                Matter
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Create compelling donation campaigns powered by Solana's
              lightning-fast blockchain. Share your story, reach your goals, and
              make a real impact with zero fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 text-lg"
                >
                  Start Your Campaign
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg border-2"
                >
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Getting started is simple. Create, share, and watch your campaign
              succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;

              return (
                <Card
                  key={index}
                  className={`relative transition-all duration-500 ${
                    isActive ? "ring-2 ring-emerald-500 scale-105" : ""
                  } dark:bg-gray-700`}
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-colors duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-green-600"
                          : "bg-gray-100 dark:bg-gray-600"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          isActive
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Solana?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built on the fastest, most cost-effective blockchain for global
              fundraising
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-700"
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg mb-4 group-hover:from-emerald-200 group-hover:to-green-200 dark:group-hover:from-emerald-800/50 dark:group-hover:to-green-800/50 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What are Blinks?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                Solana Blinks are shareable, actionable URLs that enable instant
                transactions directly from social media, messaging apps, and
                websites. One click, wallet-native payment sharing that works
                everywhere.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
                  No App Required
                </span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
                  Works Everywhere
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
                  Instant Payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-gradient-to-r from-emerald-600 to-green-700"
        style={{ backgroundColor: "#184b43" }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of creators who have raised millions through our
            platform
          </p>
          <Link href="/create">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Your Campaign Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CauseDrop</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a
                href="https://github.com/ansh808s/cause-drop"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                Github
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
