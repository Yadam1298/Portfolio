// lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchHomeData() {
  const res = await fetch(`${API_BASE}/api/public/home`);
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/api/public/skills`);
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/api/public/projects`);
  return res.json();
}

export async function fetchCertificates() {
  const res = await fetch(`${API_BASE}/api/public/certificates`);
  return res.json();
}

export async function fetchTestimonials() {
  const res = await fetch(`${API_BASE}/api/public/testimonials`);
  return res.json();
}

export async function fetchContact() {
  const res = await fetch(`${API_BASE}/api/public/contact`);
  return res.json();
}
