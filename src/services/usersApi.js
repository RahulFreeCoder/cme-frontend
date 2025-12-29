import axios from "axios";

/* Replace baseURL with your backend base */
const client = axios.create({
  baseURL: "https://pravinwadeusa-001-site1.stempurl.com/apii",
  timeout: 5000,
});

// primary fetches
export async function fetchAllUsers() {
  try {
    const { data } = await client.get("/User/GetAllUsers");
    return data;
  } catch (err) {
    // fallback sample data if backend not ready
    return sampleUsers;
  }
}


/* --- sample fallback data --- */
const sampleUsers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviewCount: 234,
    experience: 15,
    location: 'New York, NY',
    availability: 'Available Today',
    imageUrl: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBtZWRpY2FsfGVufDF8fHx8MTc2NTAxNDUxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    consultationFee: 150,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Pediatrician',
    rating: 4.8,
    reviewCount: 189,
    experience: 12,
    location: 'Los Angeles, CA',
    availability: 'Available Tomorrow',
    imageUrl: 'https://images.unsplash.com/photo-1631558554770-74e921444006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzY1MTAwNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    consultationFee: 120,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    rating: 4.9,
    reviewCount: 312,
    experience: 18,
    location: 'Chicago, IL',
    availability: 'Available Today',
    imageUrl: 'https://images.unsplash.com/photo-1755189118414-14c8dacdb082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjUwMDM1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    consultationFee: 180,
  },
  {
    id: '4',
    name: 'Dr. James Williams',
    specialty: 'Orthopedic Surgeon',
    rating: 4.7,
    reviewCount: 156,
    experience: 20,
    location: 'Houston, TX',
    availability: 'Available Next Week',
    imageUrl: 'https://images.unsplash.com/photo-1631558554770-74e921444006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzY1MTAwNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    consultationFee: 200,
  },
  {
    id: '5',
    name: 'Dr. Amanda Thompson',
    specialty: 'Psychiatrist',
    rating: 4.8,
    reviewCount: 267,
    experience: 14,
    location: 'Boston, MA',
    availability: 'Available Today',
    imageUrl: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBtZWRpY2FsfGVufDF8fHx8MTc2NTAxNDUxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    consultationFee: 160,
  },
  {
    id: '6',
    name: 'Dr. David Park',
    specialty: 'Neurologist',
    rating: 4.9,
    reviewCount: 198,
    experience: 16,
    location: 'San Francisco, CA',
    availability: 'Available Tomorrow',
    imageUrl: 'https://images.unsplash.com/photo-1755189118414-14c8dacdb082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjUwMDM1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    consultationFee: 175,
  },
];