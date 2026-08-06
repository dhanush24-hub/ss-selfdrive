# SS Self Drive — Setup Guide

## Prerequisites
- Node.js 18+, npm, Git
- Supabase project already provisioned (provided)

## Setup Steps
1. npm install
2. Copy .env.local.example → .env.local
   Fill in [YOUR-PASSWORD] with your Supabase DB password
3. npx prisma migrate dev --name init
4. npx prisma generate
5. npm run dev
6. Open http://localhost:3000

## Replace Before Launch
- Hero car image → real Grand i10 photo
- Gallery images → actual car photos
- 360° panorama → equirectangular photo of the Grand i10
- Google Maps embed → exact business address pin
- ADMIN_PASSWORD → stronger password in .env.local

## Phone Numbers
+91 91823 99850  |  +91 83099 87067
These appear as tel: links sitewide.
