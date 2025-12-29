import React from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Award,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
} from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import { DOCTOR_PROFILE_TEXT as TEXT } from "./constants/doctorProfile.constants";

/*
  doctor object structure (reference):

  {
    id,
    name,
    specialty,
    rating,
    reviewCount,
    location,
    availability,
    experience,
    consultationFee,
    imageUrl
  }
*/


export default function DoctorProfile({ doctor, onBack }) {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {TEXT.BACK_LABEL}
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <ImageWithFallback
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-32 h-32 rounded-lg object-cover shadow-lg"
              />

              <div className="flex-1">
                <h1 className="text-gray-900 text-2xl font-semibold mb-2">
                  {doctor.name}
                </h1>
                <p className="text-blue-600 mb-3">{doctor.specialty}</p>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{doctor.rating}</span>
                  <span className="text-gray-600">
                    ({doctor.reviewCount} {TEXT.LABELS.REVIEW})
                  </span>
                </div>

                <div className="flex gap-4">
                  <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600">
                    {TEXT.ACTIONS.BOOK_APPOINTMENT}
                  </button>
                  <button className="border border-blue-200 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50">
                    {TEXT.ACTIONS.SEND_MESSAGE}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Left */}
          <div className="space-y-6">

            {/* Contact */}
            <section className="bg-white p-6 rounded-lg shadow border border-blue-100">
              <h2 className="mb-4 font-semibold">{TEXT.SECTIONS.CONTACT_INFO}</h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex gap-3">
                  <Phone className="text-blue-500" />
                  {TEXT.CONTACT.PHONE}
                </div>
                <div className="flex gap-3">
                  <Mail className="text-blue-500" />
                  {TEXT.CONTACT.EMAIL}
                </div>
                <div className="flex gap-3">
                  <MapPin className="text-blue-500" />
                  {doctor.location}
                </div>
              </div>
            </section>

            {/* Availability */}
            <section className="bg-white p-6 rounded-lg shadow border border-blue-100">
              <h2 className="mb-4 font-semibold">{TEXT.SECTIONS.AVAILABILITY}</h2>
              <div className="text-gray-600 space-y-2">
                <div className="flex gap-3 text-blue-600">
                  <Calendar />
                  {doctor.availability}
                </div>
                <p>{TEXT.AVAILABILITY_TEXT.WEEKDAYS}</p>
                <p>{TEXT.AVAILABILITY_TEXT.SATURDAY}</p>
                <p>{TEXT.AVAILABILITY_TEXT.SUNDAY}</p>
              </div>
            </section>

            {/* Fee */}
            <section className="bg-white p-6 rounded-lg shadow border border-blue-100">
              <h2 className="mb-4 font-semibold">{TEXT.SECTIONS.CONSULTATION_FEE}</h2>
              <p className="text-blue-600 text-lg font-medium">
                {TEXT.LABELS.CURRENCY} {doctor.consultationFee}
              </p>
              <p className="text-gray-500">{TEXT.FEE_SUFFIX}</p>
            </section>
          </div>

          {/* Right */}
          <div className="md:col-span-2 space-y-6">

            {/* About */}
            <section className="bg-white p-6 rounded-lg shadow border border-blue-100">
              <h2 className="mb-4 font-semibold">{TEXT.SECTIONS.ABOUT}</h2>
              <p className="text-gray-600">
                Dr. {doctor.name.split(" ")[1]} is a highly qualified{" "}
                {doctor.specialty.toLowerCase()} with {doctor.experience} years
                of experience in providing excellent healthcare services.
              </p>
            </section>

            {/* Experience */}
            <section className="bg-white p-6 rounded-lg shadow border border-blue-100">
              <h2 className="mb-4 font-semibold">
                {TEXT.SECTIONS.EXPERIENCE_EDUCATION}
              </h2>

              {/* Experience */}
              <div className="flex gap-4 mb-4">
                <Briefcase className="text-blue-500" />
                <div>
                  <p className="font-medium">{TEXT.EXPERIENCE.TITLE}</p>
                  <p className="text-gray-600">
                    {doctor.experience} years in {doctor.specialty}
                  </p>
                  <p className="text-gray-500">
                    {TEXT.EXPERIENCE.DESCRIPTION}
                  </p>
                </div>
              </div>

              {/* Education */}
              <div className="flex gap-4 mb-4">
                <GraduationCap className="text-blue-500" />
                <div>
                  <p className="font-medium">{TEXT.EDUCATION.TITLE}</p>
                  <p className="text-gray-600">
                    {TEXT.EDUCATION.DEGREE_PREFIX} {doctor.specialty}
                  </p>
                  <p className="text-gray-500">
                    {TEXT.EDUCATION.INSTITUTE}
                  </p>
                </div>
              </div>

              {/* Certification */}
              <div className="flex gap-4">
                <Award className="text-blue-500" />
                <div>
                  <p className="font-medium">{TEXT.CERTIFICATION.TITLE}</p>
                  <p className="text-gray-600">
                    Board Certified {doctor.specialty}
                  </p>
                  <p className="text-gray-500">
                    {TEXT.CERTIFICATION.LICENSE}
                  </p>
                </div>
              </div>
            </section>

            {/* Specializations */}
            <section className="bg-white p-6 rounded-lg shadow border border-blue-100">
              <h2 className="mb-4 font-semibold">
                {TEXT.SECTIONS.SPECIALIZATIONS}
              </h2>
              <div className="flex flex-wrap gap-2">
                {[doctor.specialty, ...TEXT.SPECIALIZATION_TAGS].map(
                  (item) => (
                    <span
                      key={item}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white p-6 rounded-lg shadow border border-blue-100">
              <h2 className="mb-4 font-semibold">
                {TEXT.SECTIONS.REVIEWS}
              </h2>

              {TEXT.REVIEWERS.map((name) => (
                <div key={name} className="border-b border-blue-100 pb-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-gray-600">by {name}</span>
                  </div>
                  <p className="text-gray-600">{TEXT.REVIEW_TEXT}</p>
                </div>
              ))}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
