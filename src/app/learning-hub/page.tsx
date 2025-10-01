"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, GraduationCap, FolderOpen } from "lucide-react";

export default function LearningHubPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">
        Learning Hub
      </h1>

      {/* Cards stacked vertically */}
      <div className="flex flex-col space-y-6">
        {/* Glossary */}
        <Link href="/learning-hub/glossary">
          <Card className="bg-gradient-to-r from-primary to-accent text-white rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Glossary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Explore key logistics, shipping, and cargo terms with easy
                definitions.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Tutorials */}
        <Link href="/learning-hub/tutorials">
          <Card className="bg-primary text-white rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Step-by-step guides to help you understand cargo processes and
                tools.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Featured Resources */}
        <Link href="/learning-hub/resources">
          <Card className="bg-accent text-white rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-black" />
              </div>
              <CardTitle className="text-xl">Featured Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Access handpicked resources, articles, and reports to boost your
                knowledge.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}