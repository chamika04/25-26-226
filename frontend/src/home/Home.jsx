import React from 'react';
import Navbar from '../components/Navbar';
import MyFooter from '../components/MyFooter';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-2xl font-bold">Home (placeholder)</h1>
        <p className="mt-4">This is a placeholder Home component to satisfy router imports.</p>
      </main>
      <MyFooter />
    </div>
  );
}
