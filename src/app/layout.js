"use client";
import { metadata } from './metadata';
import { TaskProvider } from "../context/TasksContext";
import { Toaster } from "react-hot-toast";
import Layout from "../components/Layout";
import { Navbar } from "../components/NavBar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="eng">
      <body>
        <TaskProvider>
          <Navbar />
          <Layout metadata={metadata}>
            {children}
          </Layout>
          <Toaster />
        </TaskProvider>
      </body>
    </html>
  );
}
