import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";

import User from "./models/User.js";
import Announcement from "./models/Announcement.js";
import Assignment from "./models/Assignment.js";
import Complaint from "./models/Complaint.js";
import Timetable from "./models/Timetable.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    let demoUser = await User.findOne({
      email: "demo@smartcampus.com",
    });

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash("Demo@123", 10);

      demoUser = await User.create({
        name: "Demo Student",
        email: "demo@smartcampus.com",
        password: hashedPassword,
        role: "Student",
        department: "Electronics & Communication Engineering",
        year: "3rd Year",
      });

      console.log("Demo student account created successfully.");
    } else {
      console.log("Demo student account already exists.");
    }

    await Announcement.deleteMany({});
    await Assignment.deleteMany({});
    await Complaint.deleteMany({});
    await Timetable.deleteMany({});

    await Announcement.insertMany([
      {
        title: "Mid-Semester Examination Schedule",
        content:
          "The examination schedule has been published for all students.",
        priority: "Important",
        postedBy: demoUser._id,
      },
      {
        title: "Campus Placement Drive",
        content:
          "A new placement drive will be conducted on campus next week.",
        priority: "Normal",
        postedBy: demoUser._id,
      },
      {
        title: "Library Timing Updated",
        content:
          "The central library will remain open until 8:00 PM on weekdays.",
        priority: "Normal",
        postedBy: demoUser._id,
      },
    ]);

    await Assignment.insertMany([
      {
        title: "Data Structures Assignment",
        description: "Complete the assigned DSA problems.",
        subject: "Data Structures",
        dueDate: new Date("2026-09-10"),
        createdBy: demoUser._id,
        assignedTo: [demoUser._id],
      },
      {
        title: "Database Management Assignment",
        description: "Complete the DBMS assignment.",
        subject: "Database Management",
        dueDate: new Date("2026-09-12"),
        createdBy: demoUser._id,
        assignedTo: [demoUser._id],
      },
      {
        title: "Web Development Project",
        description:
          "Submit the first version of the web development project.",
        subject: "Web Development",
        dueDate: new Date("2026-09-15"),
        createdBy: demoUser._id,
        assignedTo: [demoUser._id],
      },
    ]);

    await Complaint.insertMany([
      {
        title: "Classroom Projector Issue",
        description:
          "The projector in the classroom is not working properly.",
        reportedBy: demoUser._id,
        status: "In Progress",
        resolutionNote: "",
      },
      {
        title: "Water Cooler Maintenance",
        description:
          "The water cooler near the department needs maintenance.",
        reportedBy: demoUser._id,
        status: "Pending",
        resolutionNote: "",
      },
    ]);

    await Timetable.insertMany([
      {
        day: "Monday",
        subject: "Data Structures",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        room: "Room 201",
        department: demoUser.department || "",
        year: demoUser.year || "",
      },
      {
        day: "Monday",
        subject: "Database Management",
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        room: "Lab 2",
        department: demoUser.department || "",
        year: demoUser.year || "",
      },
      {
        day: "Friday",
        subject: "Web Development",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        room: "Lab 1",
        department: demoUser.department || "",
        year: demoUser.year || "",
      },
    ]);

    console.log("");
    console.log("=================================");
    console.log("Demo data created successfully!");
    console.log("=================================");
    console.log("");
    console.log("Demo Email: demo@smartcampus.com");
    console.log("Demo Password: Demo@123");
    console.log("");
    console.log("Announcements: 3");
    console.log("Assignments: 3");
    console.log("Complaints: 2");
    console.log("Timetable entries: 3");
    console.log("");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("Failed to create demo data:");
    console.error(error.message);
    console.error("");

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();