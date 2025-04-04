import React, { useState } from "react";

const CourseRecommender = () => {
  const [interests, setInterests] = useState("");
  const [enrollments, setEnrollments] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult("⏳ Generating suggestions...");

    try {
      const res = await fetch("http://localhost:3000/suggest-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, pastEnrollments: enrollments })
      });

      const data = await res.json();
      setResult(data.suggestions);
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>🎯 Personalized Course Recommender</h2>

      <label>Interests:</label>
      <textarea
        rows="3"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        placeholder="e.g. AI, Robotics, Data Visualization"
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <label style={{ marginTop: 20 }}>Past Enrollments:</label>
      <textarea
        rows="3"
        value={enrollments}
        onChange={(e) => setEnrollments(e.target.value)}
        placeholder="e.g. Python Basics, HTML & CSS"
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: 10,
          fontSize: 16,
          backgroundColor: "#4CAF50",
          color: "black",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Generating..." : "Get Suggestions"}
      </button>

      <div
        style={{
          backgroundColor: "#f4f4f4", // Light grey background
          color: "#222",              // Dark readable text
          marginTop: 30,
          padding: 15,
          borderRadius: 8,
          whiteSpace: "pre-line",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)" // Optional: adds nice subtle depth
        }}
      >
        {result}
      </div>
    </div>
  );
};

export default CourseRecommender;
