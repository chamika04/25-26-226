import React from 'react';
import Navbar from './Navbar';
import MyFooter from './MyFooter';

export default function About() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-2xl font-bold">About (placeholder)</h1>
        <p className="mt-4">This is a placeholder About page.</p>
      </main>
      <MyFooter />
    </div>
  );
}
