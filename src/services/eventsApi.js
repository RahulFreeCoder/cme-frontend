import axiosInstance from "./axiosinstance";

export async function fetchUpcomingEvents(startDateFrom) {
  try {
    // Axios will append ?startDateFrom=... to the URL
    const response = await axiosInstance.get("/api/CME/cme", {
      params: { startDateFrom } 
    });

    return Array.isArray(response.data) ? response.data : response.data.events || [];
  } catch (err) {
    console.warn("Fetching events failed, using sample data", err);
    return sampleEvents;
  }
}

export async function fetchEventStats() {
  try {
    // Use same axios instance
    const { data } = await axiosInstance.get("/events/stats");
    return data;
  } catch (err) {
    console.warn("Fetching event stats failed, using fallback", err);
    return { totalEvents: 6, registered: 0, upcoming: 6 };
  }
}

/* --- sample fallback data --- */
const sampleEvents = [
  {
    "id": "694b8176e05d2e916a74a583",
    "cmeId": "CME-2025-001",
    "title": "Advanced Cardiology Update 2025",
    "description": "Latest advancements and clinical practices in cardiology.",
    "speciality": [
      "Cardiology"
    ],
    "cmeCategories": [
      "Clinical Update",
      "Workshop"
    ],
    "startDate": "2025-03-10T09:00:00Z",
    "endDate": "2025-03-12T17:00:00Z",
    "startTime": "09:00 AM",
    "endTime": "05:00 PM",
    "location": {
      "address": "123 Medical Plaza",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "zipCode": "400001"
    },
    "registrationFees": [
      {
        "category": "Doctor",
        "price": 5000,
        "rule": "Early Bird",
        "discountPercent": 10
      }
    ],
    "credits": 12,
    "totalSeats": 300,
    "registeredSeats": 0,
    "isActive": true,
    "schedule": [
      {
        "date": "2025-03-10T00:00:00Z",
        "time": "10:00 AM - 11:30 AM",
        "topics": "Interventional Cardiology Trends"
      }
    ],
    "speakers": [
      {
        "name": "Dr. Rajesh Mehta",
        "speciality": "Cardiology",
        "designation": "Senior Consultant",
        "isKeySpeaker": true,
        "details": "20+ years of experience in interventional cardiology.",
        "profileImage": "https://example.com/speakers/rajesh.jpg"
      }
    ],
    "organizer": {
      "organization": "Indian Heart Association",
      "email": "info@iha.org",
      "phone": "+91-9876543210",
      "website": "https://iha.org",
      "committee": "Scientific Committee"
    },
    "contact": {
      "name": "Amit Sharma",
      "phoneNumber": "+91-9123456789",
      "email": "amit.sharma@iha.org"
    },
    "paymentDetails": {
      "accountNumber": "123456789012",
      "accountName": "Indian Heart Association",
      "ifscCode": "SBIN0000123",
      "upiCode": "iha@upi",
      "date": "2025-01-15T00:00:00Z"
    },
    "additionalInformation": [
      "Certificate will be provided",
      "Lunch included"
    ]
  },
  {
    "id": "694b818be05d2e916a74a584",
    "cmeId": "CME-2025-014",
    "title": "Digital Healthcare & AI Symposium",
    "description": "Exploring AI, ML, and digital transformation in healthcare.",
    "speciality": [
      "Healthcare IT",
      "Radiology"
    ],
    "cmeCategories": [
      "Technology",
      "Conference"
    ],
    "startDate": "2025-06-20T10:00:00Z",
    "endDate": "2025-06-21T04:00:00Z",
    "startTime": "10:00 AM",
    "endTime": "04:00 PM",
    "location": {
      "address": "Tech Convention Center",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "zipCode": "560001"
    },
    "registrationFees": [
      {
        "category": "Student",
        "price": 1500,
        "rule": "Standard",
        "discountPercent": 0
      },
      {
        "category": "Professional",
        "price": 4000,
        "rule": "Group Registration",
        "discountPercent": 15
      }
    ],
    "credits": 8,
    "totalSeats": 500,
    "registeredSeats": 0,
    "isActive": true,
    "schedule": [
      {
        "date": "2025-06-20T00:00:00Z",
        "time": "11:00 AM - 12:30 PM",
        "topics": "AI in Medical Imaging"
      }
    ],
    "speakers": [
      {
        "name": "Dr. Neha Kulkarni",
        "speciality": "Radiology",
        "designation": "AI Research Lead",
        "isKeySpeaker": true,
        "details": "Expert in AI-based diagnostic systems.",
        "profileImage": "https://example.com/speakers/neha.jpg"
      }
    ],
    "organizer": {
      "organization": "HealthTech Innovators",
      "email": "contact@healthtech.io",
      "phone": "+91-9988776655",
      "website": "https://healthtech.io",
      "committee": "Organizing Committee"
    },
    "contact": {
      "name": "Rohit Verma",
      "phoneNumber": "+91-9012345678",
      "email": "rohit@healthtech.io"
    },
    "paymentDetails": {
      "accountNumber": "987654321098",
      "accountName": "HealthTech Innovators Pvt Ltd",
      "ifscCode": "HDFC0000456",
      "upiCode": "healthtech@upi",
      "date": "2025-04-01T00:00:00Z"
    },
    "additionalInformation": [
      "Hands-on workshops",
      "Networking dinner on Day 1"
    ]
  }
];