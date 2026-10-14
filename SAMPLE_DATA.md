# Marketplace — Sample Records (Template)

> **Note:** This file documents the original YouTube reference dataset (kept for schema shape); the shipped theme's sample data is podcast-native — see `theme/lib/data.ts`.

**Example records from each catalog table**, showing the data shape the marketplace pages render. Use as fixture/reference data when building against the schema in `DATABASE_SCHEMA.md`.

Conventions: `—` = NULL/absent · `✓` = true · numbers use thousands separators · timestamps truncated to date. **Emails are omitted from the talent table** (PII — see requirement G5 in `MARKETPLACE_PAGES.md`); they appear only in the complete JSON records below, which document every column.

---

## 1. `public.talents` — sample records

Readable subset of columns. Complete records (all columns) follow the table.

| user_id | name | functional_area | country | hire_me | verified | skills | portfolio | videos | views | rate/hr | last_active |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 381275 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-04-08 |
| 201837 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-04-19 |
| 103497 | Mithun Roy | Channel Manager | — | — | — | 0 | 1 | 0 | 0 | — | 2023-12-31 |
| 463462 | — | Scriptwriter | — | — | — | 0 | 0 | 0 | 0 | — | 2025-11-19 |
| 400229 | — | Scriptwriter | — | — | — | 0 | 0 | 0 | 0 | — | 2025-06-10 |
| 393768 |  Roy Diéguez Estévez | Video Editor | Spain | ✓ | — | 6 | 1 | 0 | 0 | $25.00 | 2025-05-29 |
| 71108 | Alisha | Thumbnail Designer | — | — | — | 0 | 1 | 0 | 0 | — | 2023-12-31 |
| 230441 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2024-05-12 |
| 343619 | Adam Vollmar | Scriptwriter | — | — | — | 0 | 0 | 0 | 0 | — | 2024-12-31 |
| 468507 | Abdul Basit | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-11-21 |
| 436171 | Vini Labres | Video Editor | Brazil | — | — | 10 | 1 | 0 | 0 | — | 2025-11-29 |
| 213639 | — | YouTube Strategist | — | — | — | 0 | 0 | 0 | 0 | — | 2024-04-23 |
| 82276 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 280757 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-08-11 |
| 234242 | — | Channel Manager | — | — | — | 0 | 0 | 0 | 0 | — | 2024-05-15 |
| 273847 | Nikolai Ivanov | Video Editor | — | — | — | 0 | 1 | 0 | 0 | — | 2024-07-28 |
| 219726 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2024-04-27 |
| 54452 | aymen mehmood | Thumbnail Designer | Pakistan | ✓ | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 439125 | Ujjwal desmukh | Video Editor | — | — | — | 5 | 1 | 0 | 0 | — | 2025-09-23 |
| 22108 | Emma | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 500216 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2026-01-24 |
| 409999 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-07-06 |
| 432297 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-09-23 |
| 100150 | Shivam Dwivedi | Video Editor | — | ✓ | — | 0 | 1 | 0 | 0 | — | 2023-12-31 |
| 442807 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-10-02 |
| 389871 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-05-07 |
| 427169 | Prakash Regmi | Video Editor | Nepal | — | — | 0 | 0 | 0 | 0 | $15.00 | 2025-08-23 |
| 139041 | Shubham Kumar | Video Editor | India | ✓ | — | 0 | 1 | 0 | 0 | — | 2024-01-01 |
| 118239 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 426795 | Tasnim | Video Editor | United States | ✓ | — | 0 | 1 | 4 | 0 | $30.00 | 2025-10-13 |
| 386875 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-05-03 |
| 151983 | Fazal rahem | Video Editor | — | — | — | 0 | 2 | 0 | 0 | — | 2024-01-20 |
| 250571 | Jasmin Kelly | Channel Manager | — | — | — | 0 | 0 | 0 | 0 | — | 2024-06-07 |
| 485128 | Lukasz | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-12-23 |
| 322498 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2024-11-09 |
| 347765 | shan jeron | Video Editor | — | — | — | 14 | 0 | 0 | 0 | — | 2025-01-09 |
| 331133 | Aaron Jester Garcia | Video Editor | Philippines | ✓ | — | 2 | 1 | 0 | 0 | $30.00 | 2024-12-11 |
| 277613 | — | Scriptwriter | — | — | — | 0 | 0 | 0 | 0 | — | 2024-08-05 |
| 298974 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-09-25 |
| 82706 | harmeet singh | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 349793 | — | Scriptwriter | — | — | — | 0 | 0 | 0 | 0 | — | 2025-01-13 |
| 313969 | Adarsh Maurya | Video Editor | — | — | — | 11 | 1 | 0 | 0 | — | 2025-11-23 |
| 29994 | Jasmine | Video Editor | United States | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 24928 | Deniz | Scriptwriter | — | — | — | 0 | 1 | 0 | 0 | — | 2023-12-31 |
| 35508 | Tonmoy GD | Thumbnail Designer | — | ✓ | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 227638 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-05-09 |
| 142487 | Dilawar Rehmani | Channel Manager | — | — | — | 0 | 0 | 0 | 0 | — | 2024-01-02 |
| 412575 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-07-13 |
| 262857 |  | Video Editor | Spain | ✓ | — | 0 | 0 | 12 | 0 | $50.00 | 2026-01-05 |
| 227155 | Noman | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2024-05-08 |
| 185872 | Akshay Dhingaan | Video Editor | — | — | — | 0 | 1 | 0 | 0 | — | 2024-04-01 |
| 187861 | Sweetam Moirangthem | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-04-05 |
| 364866 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-02-17 |
| 273936 | ada chukwujetu | YouTube Strategist | — | — | — | 0 | 1 | 0 | 0 | — | 2024-07-28 |
| 180049 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-03-29 |
| 332782 | Igor Zalewski | Video Editor | — | — | — | 3 | 1 | 0 | 0 | — | 2024-12-05 |
| 37966 | Yash Dhane | Video Editor | India | ✓ | — | 0 | 1 | 0 | 0 | — | 2024-01-23 |
| 504598 | Giovanna Franco | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2026-02-03 |
| 304045 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-10-07 |
| 310818 | Shreyan burner | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-12-14 |
| 350414 | — | Channel Manager | — | — | — | 0 | 0 | 0 | 0 | — | 2025-01-14 |
| 58418 | Roshan Raha | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 313193 | Katyanna Vason | Video Editor | United States | ✓ | — | 0 | 1 | 4 | 0 | — | 2025-01-20 |
| 295831 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-09-15 |
| 434995 | Rizwana Shabbir chaudhari | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-09-15 |
| 216526 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-04-24 |
| 451641 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-10-21 |
| 301890 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-10-02 |
| 363067 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2025-02-12 |
| 279139 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-08-08 |
| 187682 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2024-04-05 |
| 51041 | Faiq Javaid | Video Editor | Pakistan | ✓ | — | 7 | 2 | 8 | 0 | $50.00 | 2026-01-05 |
| 496145 | Akhil R Nair | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2026-01-16 |
| 88952 | Rushi Rahate | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 31077 | Angela Alvarado | YouTube Strategist | United States | ✓ | — | 0 | 1 | 1 | 0 | — | 2024-06-06 |
| 110749 | — | Scriptwriter | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 17050 | — | Scriptwriter | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 418970 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2025-07-31 |
| 65501 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 287637 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2024-08-26 |
| 472311 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-11-28 |
| 420376 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-09-16 |
| 105241 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 218508 | Mr. Frankie | Video Editor | — | — | — | 0 | 1 | 0 | 0 | — | 2024-04-26 |
| 325006 | Tony Liuzzi | Video Editor | — | — | — | 8 | 2 | 0 | 0 | — | 2026-01-24 |
| 342446 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-02-02 |
| 97660 | Alex | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 457313 | Dev | Video Editor | — | — | — | 0 | 1 | 0 | 0 | — | 2025-11-02 |
| 270349 | — | Thumbnail Designer | — | — | — | 0 | 0 | 0 | 0 | — | 2024-07-20 |
| 103498 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 483514 | Thasys Emanuel | Video Editor | Portugal | — | — | 0 | 0 | 0 | 0 | $40.00 | 2025-12-19 |
| 386342 | — | Creative Director | — | — | — | 0 | 0 | 0 | 0 | — | 2025-04-25 |
| 124511 | Dead | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 348044 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-01-10 |
| 64814 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2023-12-31 |
| 410597 | — | Video Editor | — | — | — | 0 | 0 | 0 | 0 | — | 2025-07-07 |
| 322529 | Eric Macfarlane | Video Editor | United States | ✓ | — | 8 | 1 | 0 | 0 | $25.00 | 2024-11-12 |
| 81561 | Ashutosh Pandey | Video Editor | — | — | — | 0 | 1 | 0 | 0 | — | 2023-12-31 |
| 194613 | UNS4NEgostupid | Video Editor | — | ✓ | — | 0 | 0 | 1 | 0 | — | 2024-06-02 |
| 416590 | David | Thumbnail Designer | United Kingdom | ✓ | — | 12 | 1 | 6 | 0 | $5.00 | 2025-08-06 |

### Complete records (all columns)

**`user_id` 381275**

```json
{
  "user_id": 381275,
  "first_name": null,
  "last_name": null,
  "name": null,
  "email": "mominafatima280@gmail.com",
  "functional_area": "Video Editor",
  "about": null,
  "verified": false,
  "is_active": false,
  "profile_url": null,
  "image": null,
  "country_id": null,
  "state_id": null,
  "city_id": null,
  "country": null,
  "state": null,
  "city": null,
  "skills": [],
  "functional_areas": [
    "Video Editor"
  ],
  "styles": [],
  "skills_count": 0,
  "portfolio_count": 0,
  "video_count": 0,
  "total_video_views": 0,
  "total_video_likes": 0,
  "total_video_comments": 0,
  "applications_count": 0,
  "hire_me": false,
  "hire_me_availability_full_time": false,
  "hire_me_availability_part_time": false,
  "hire_me_availability_project_based": false,
  "hire_me_location_hybrid": false,
  "hire_me_location_remote": false,
  "salary_per_hour": null,
  "salary_annual": null,
  "display_salary": "false",
  "website_link": null,
  "behance_link": null,
  "dribbble_link": null,
  "verified_twitter_username": null,
  "youtube_channel_id": null,
  "youtube_channel_verified_at": null,
  "story": null,
  "created_at": "2025-04-08T12:37:38+00:00",
  "last_activity_at": "2025-04-08T12:43:30+00:00",
  "synced_at": "2026-02-05T01:24:57.071681+00:00"
}
```

**`user_id` 201837**

```json
{
  "user_id": 201837,
  "first_name": null,
  "last_name": null,
  "name": null,
  "email": "aashikaobani@gmail.com",
  "functional_area": "Video Editor",
  "about": null,
  "verified": false,
  "is_active": false,
  "profile_url": null,
  "image": null,
  "country_id": null,
  "state_id": null,
  "city_id": null,
  "country": null,
  "state": null,
  "city": null,
  "skills": [],
  "functional_areas": [
    "Video Editor"
  ],
  "styles": [],
  "skills_count": 0,
  "portfolio_count": 0,
  "video_count": 0,
  "total_video_views": 0,
  "total_video_likes": 0,
  "total_video_comments": 0,
  "applications_count": 0,
  "hire_me": false,
  "hire_me_availability_full_time": false,
  "hire_me_availability_part_time": false,
  "hire_me_availability_project_based": false,
  "hire_me_location_hybrid": false,
  "hire_me_location_remote": false,
  "salary_per_hour": null,
  "salary_annual": null,
  "display_salary": "false",
  "website_link": null,
  "behance_link": null,
  "dribbble_link": null,
  "verified_twitter_username": null,
  "youtube_channel_id": null,
  "youtube_channel_verified_at": null,
  "story": null,
  "created_at": "2024-04-19T16:00:18+00:00",
  "last_activity_at": "2024-04-19T16:00:25+00:00",
  "synced_at": "2026-02-05T01:24:57.071681+00:00"
}
```

**`user_id` 103497**

```json
{
  "user_id": 103497,
  "first_name": "Mithun",
  "last_name": "Roy",
  "name": "Mithun Roy",
  "email": "qualifiedacademy22@gmail.com",
  "functional_area": "Channel Manager",
  "about": null,
  "verified": false,
  "is_active": false,
  "profile_url": "Hi,\r\nI am MITHUN,\r\nI am a professional digital marketer all social media  expert. I having practical Experience for 5 years of practical experience from Outsourcing Institute BD.\r\n\r\nI can Facebook page create and setup, Instagram growth and promotion, YouTube channel create and setup, YouTube Video SEO, Background Remove, Image Editing, B2B Lead generation.\r\n\r\nI provide these services in with faithfulness. Also, data entry I do very efficiently. Client's satisfaction is my only wish",
  "image": "user_images/1699650837103497.jpg",
  "country_id": null,
  "state_id": null,
  "city_id": null,
  "country": null,
  "state": null,
  "city": null,
  "skills": [],
  "functional_areas": [
    "Channel Manager"
  ],
  "styles": [],
  "skills_count": 0,
  "portfolio_count": 1,
  "video_count": 0,
  "total_video_views": 0,
  "total_video_likes": 0,
  "total_video_comments": 0,
  "applications_count": 0,
  "hire_me": false,
  "hire_me_availability_full_time": false,
  "hire_me_availability_part_time": false,
  "hire_me_availability_project_based": false,
  "hire_me_location_hybrid": false,
  "hire_me_location_remote": false,
  "salary_per_hour": null,
  "salary_annual": null,
  "display_salary": "false",
  "website_link": null,
  "behance_link": null,
  "dribbble_link": null,
  "verified_twitter_username": null,
  "youtube_channel_id": null,
  "youtube_channel_verified_at": null,
  "story": null,
  "created_at": "2023-11-10T21:00:57+00:00",
  "last_activity_at": "2023-12-31T00:00:00+00:00",
  "synced_at": "2026-02-05T01:24:57.071681+00:00"
}
```

---

## 2. `public.companies` — sample records

Readable subset of columns. Complete records (all columns) follow the table.

| company_id | company_name | industry | status | website | subscribers | created |
|---|---|---|---|---|---|---|
| 103497 | Kenta Carl Hoadley | YouTube/Media | active | https://youtube.com/channel/395616 | — | 2025-12-26 |
| 71108 | Grenton | YouTube/Media | active | https://youtube.com/channel/291716 | — | 2025-03-05 |
| 82276 | Signature Framework | YouTube/Media | active | mysnapshot.co | — | 2025-06-19 |
| 54452 | ZeNyovec | YouTube/Media | active | https://youtube.com/channel/245730 | — | 2024-11-01 |
| 22108 | Лука Јовић | YouTube/Media | active | https://youtube.com/channel/33606 | — | 2024-02-13 |
| 100150 | itzRealme | YouTube/Media | active | https://youtube.com/channel/384708 | — | 2025-11-28 |
| 82706 | Certified Viral Fails | YouTube/Media | active | https://youtube.com/channel/19844 | — | 2025-06-23 |
| 29994 | Nesi | YouTube/Media | active | https://youtube.com/channel/105103 | — | 2024-04-25 |
| 24928 | D-GROW | YouTube/Media | active | https://youtube.com/channel/150036 | — | 2024-03-15 |
| 35508 | Khushi Raj | YouTube/Media | active | https://youtube.com/channel/189657 | — | 2024-06-11 |
| 37966 | SONBU | YouTube/Media | active | https://youtube.com/channel/197523 | — | 2024-07-03 |
| 58418 | Rumman Mashrafi | YouTube/Media | active | https://youtube.com/channel/255731 | — | 2024-12-03 |
| 51041 | BlazeLifehammer | YouTube/Media | active | https://youtube.com/channel/235432 | — | 2024-10-08 |
| 88952 | LdtvYT | YouTube/Media | active | https://youtube.com/channel/347019 | — | 2025-08-20 |
| 31077 | AshMash | YouTube/Media | active | https://youtube.com/channel/163405 | — | 2024-05-05 |
| 17050 | Few Facts | YouTube/Media | active | https://youtube.com/channel/112349 | — | 2023-12-16 |
| 65501 | Rama Apriansyah | YouTube/Media | active | https://youtube.com/channel/275636 | — | 2025-01-22 |
| 105241 | Aventura Sin Límites | YouTube/Media | prospect | https://youtube.com/channel/400782 | — | 2026-01-08 |
| 97660 | Razz | YouTube/Media | active | https://youtube.com/channel/376361 | — | 2025-11-09 |
| 103498 | KHALID Physics 🚀 | YouTube/Media | active | https://youtube.com/channel/395624 | — | 2025-12-26 |
| 64814 | SeekThyCross | YouTube/Media | active | https://youtube.com/channel/274419 | — | 2025-01-18 |
| 81561 | XanZer- Minecraft | YouTube/Media | prospect | https://youtube.com/channel/322768 | — | 2025-06-12 |
| 58814 | nomay | YouTube/Media | active | bawsny.com | — | 2024-12-06 |
| 103385 | Emirhan Boyraz | YouTube/Media | active | https://youtube.com/channel/395266 | — | 2025-12-25 |
| 40325 | Technical Eight | YouTube/Media | active | https://youtube.com/channel/205091 | — | 2024-07-23 |
| 91052 | ksy edit | YouTube/Media | active | https://youtube.com/channel/330722 | — | 2025-09-08 |
| 19422 | Soldier gaming | YouTube/Media | active | https://youtube.com/channel/125661 | — | 2024-01-14 |
| 29983 | Amazon worker  | YouTube/Media | active | https://youtube.com/channel/169328 | — | 2024-04-25 |
| 34050 | Tanner Schuck | YouTube/Media | active | https://youtube.com/channel/184468 | — | 2024-05-30 |
| 3697 | SV2 | YouTube/Media | active | https://youtube.com/channel/5188 | — | 2023-05-22 |
| 29863 | Dr Waad Amin - Fitness Nutritionist | YouTube/Media | prospect | https://youtube.com/channel/168891 | — | 2024-04-24 |
| 103452 | populaarrz | YouTube/Media | active | https://youtube.com/channel/395444 | — | 2025-12-26 |
| 53319 | Gian Disorder | YouTube/Media | active | https://youtube.com/channel/215676 | — | 2024-10-23 |
| 75829 | Skot Video | YouTube/Media | active | https://youtube.com/channel/275844 | — | 2025-04-19 |
| 108736 | reggae lover's  | YouTube/Media | active | https://youtube.com/channel/UC0nIz2bf-tYI8Ezm767m01Q | — | 2026-02-02 |
| 74665 | Jackie Droujko | YouTube/Media | active | https://youtube.com/channel/301418 | — | 2025-04-07 |
| 37031 | indibiz telkom kediri | YouTube/Media | active | https://youtube.com/channel/194623 | — | 2024-06-25 |
| 52206 | SyncskillsAU | YouTube/Media | active | https://youtube.com/channel/207401 | — | 2024-10-16 |
| 3156 | Dan Ganso | YouTube/Media | active | https://youtube.com/channel/32035 | — | 2023-05-02 |
| 95170 | Hack Geneman | YouTube/Media | active | https://youtube.com/channel/368231 | — | 2025-10-19 |
| 86641 | xp.multimedia | YouTube/Media | active | https://youtube.com/channel/338965 | — | 2025-07-29 |
| 27593 | Immortal Stoic | YouTube/Media | prospect | https://youtube.com/channel/160102 | — | 2024-04-09 |
| 17675 | Hussain Graphics | YouTube/Media | active | https://youtube.com/channel/115807 | — | 2023-12-25 |
| 31804 | polstyle 2.0 | YouTube/Media | active | https://youtube.com/channel/176042 | — | 2024-05-12 |
| 61300 | Tom Talk | YouTube/Media | active | https://youtube.com/channel/265363 | — | 2024-12-27 |
| 32438 | PRESS PLAY | YouTube/Media | active | https://youtube.com/channel/178894 | — | 2024-05-17 |
| 21662 | Collin Cornwell | YouTube/Media | active | https://youtube.com/channel/136295 | — | 2024-02-07 |
| 32784 | BORS Finance | YouTube/Media | active | https://youtube.com/channel/180244 | — | 2024-05-20 |
| 48419 | SumiGames | YouTube/Media | active | https://youtube.com/channel/227840 | — | 2024-09-16 |
| 77257 | TENSE7 | YouTube/Media | active | https://youtube.com/channel/309570 | — | 2025-05-01 |
| 98762 | Suho TV | YouTube/Media | active | https://youtube.com/channel/379645 | — | 2025-11-17 |
| 35573 | Standard Malcolm | YouTube/Media | active | https://youtube.com/channel/189856 | — | 2024-06-12 |
| 67187 | Mia Winchester (Mia794) | YouTube/Media | active | https://youtube.com/channel/253891 | — | 2025-02-02 |
| 72895 | Footy Futures | YouTube/Media | active | https://youtube.com/channel/297088 | — | 2025-03-20 |
| 60788 | SamDD EditLab | YouTube/Media | active | https://youtube.com/channel/263055 | — | 2024-12-22 |
| 75434 | Instinct Footy | YouTube/Media | active | https://youtube.com/channel/304599 | — | 2025-04-15 |
| 39617 | FryBry | YouTube/Media | active | https://youtube.com/channel/202858 | — | 2024-07-17 |
| 28960 | Cristina Acebo | YouTube/Media | active | https://youtube.com/channel/165319 | — | 2024-04-19 |
| 48251 | GospodinG™ | YouTube/Media | active | https://youtube.com/channel/227340 | — | 2024-09-15 |
| 88373 | DudeDhruv | YouTube/Media | active | https://youtube.com/channel/344964 | — | 2025-08-13 |
| 83248 | hello !!! | YouTube/Media | active | https://youtube.com/channel/328603 | — | 2025-06-28 |
| 11295 | Jot Brar | YouTube/Media | active | https://youtube.com/channel/72397 | — | 2023-10-08 |
| 101359 | Ben Pakulski - Muscle Intelligence | YouTube/Media | prospect | https://youtube.com/channel/59625 | — | 2025-12-08 |
| 50382 | Feripe | YouTube/Media | active | https://youtube.com/channel/233484 | — | 2024-10-02 |
| 86423 | FeED | YouTube/Media | active | https://youtube.com/channel/338226 | — | 2025-07-27 |
| 54962 | Mica | YouTube/Media | active | https://youtube.com/channel/247436 | — | 2024-11-05 |
| 29773 | TopReaux | YouTube/Media | active | https://youtube.com/channel/66233 | — | 2024-04-23 |
| 30454 | Repdude | YouTube/Media | active | https://youtube.com/channel/171137 | — | 2024-04-29 |
| 40075 | Elevate Wealth Network | YouTube/Media | active | https://youtube.com/channel/204277 | — | 2024-07-21 |
| 48014 | C.HASSAN السي حسن | YouTube/Media | prospect | https://youtube.com/channel/226657 | — | 2024-09-13 |
| 74504 | Valrex Gaming | YouTube/Media | active | https://youtube.com/channel/301623 | — | 2025-04-05 |
| 5819 | Elif Hız | YouTube/Media | active | https://youtube.com/channel/47247 | — | 2023-07-20 |
| 16244 | Xelif Extra | YouTube/Media | active | https://youtube.com/channel/107636 | — | 2023-12-05 |
| 95828 |  TWIXTOR WORLD | YouTube/Media | active | https://youtube.com/channel/370400 | — | 2025-10-25 |
| 5558 | Kiwi Modulars | YouTube/Media | active | https://youtube.com/channel/46942 | — | 2023-07-15 |
| 31288 | Brandon Meyer | YouTube/Media | active | https://youtube.com/channel/173994 | — | 2024-05-07 |
| 90166 | baba akha | YouTube/Media | active | https://youtube.com/channel/351045 | — | 2025-08-31 |
| 23877 | Peer Purpose | YouTube/Media | active | https://youtube.com/channel/145826 | — | 2024-03-03 |
| 100808 | Prokolol | YouTube/Media | prospect | https://youtube.com/channel/387008 | — | 2025-12-04 |
| 51811 | Av RoAster | YouTube/Media | active | https://youtube.com/channel/237854 | — | 2024-10-13 |
| 9347 | LIFEwithTP | YouTube/Media | active | https://youtube.com/channel/61994 | — | 2023-09-10 |
| 99218 | Kyle Butterfield  | YouTube/Media | active | https://youtube.com/channel/381643 | — | 2025-11-21 |
| 57196 | Jamar | YouTube/Media | active | https://youtube.com/channel/253775 | — | 2024-11-23 |
| 10476 | UZMI CREATIONS | YouTube/Media | active | https://youtube.com/channel/18149 | — | 2023-09-25 |
| 82930 | Welsh Rugby Union | YouTube/Media | active | https://youtube.com/channel/327494 | — | 2025-06-25 |
| 84771 | Dazastian | YouTube/Media | active | https://youtube.com/channel/185232 | — | 2025-07-11 |
| 81002 | Atharva Walke | YouTube/Media | active | https://youtube.com/channel/320993 | — | 2025-06-06 |
| 70282 | ps5upload | YouTube/Media | active | https://youtube.com/channel/289842 | — | 2025-02-26 |
| 36720 | Tang | YouTube/Media | active | https://youtube.com/channel/193537 | — | 2024-06-22 |
| 41172 | CriminallyUnfunny | YouTube/Media | active | https://youtube.com/channel/206723 | — | 2024-07-26 |
| 102938 | Nirbhay编辑 | YouTube/Media | active | https://youtube.com/channel/393853 | — | 2025-12-21 |
| 104470 | Asidyx | YouTube/Media | active | https://youtube.com/channel/398379 | — | 2026-01-03 |
| 103248 | Irtiza Hamail | YouTube/Media | active | https://youtube.com/channel/365528 | — | 2025-12-24 |
| 26901 | ART Mentor | YouTube/Media | active | https://youtube.com/channel/157563 | — | 2024-04-02 |
| 42296 | TheCobraSpectrum | YouTube/Media | active | https://youtube.com/channel/209373 | — | 2024-08-01 |
| 105227 | Nexgen | YouTube/Media | active | https://youtube.com/channel/400731 | — | 2026-01-08 |
| 101969 | Ashi | YouTube/Media | active | https://youtube.com/channel/390797 | — | 2025-12-13 |
| 99454 | Pradum Kumar | YouTube/Media | active | https://youtube.com/channel/382524 | — | 2025-11-23 |
| 4302 | Bcazboy | YouTube/Media | active | https://youtube.com/channel/40849 | — | 2023-06-19 |
| 96302 | Kalmaya | YouTube/Media | active | https://youtube.com/channel/371924 | — | 2025-10-29 |

### Complete records (all columns)

**`company_id` 103497**

```json
{
  "company_id": "103497",
  "company_name": "Kenta Carl Hoadley",
  "industry": "YouTube/Media",
  "website": "https://youtube.com/channel/395616",
  "logo_url": null,
  "description": null,
  "status": "active",
  "company_size": null,
  "location": null,
  "source": null,
  "notes": null,
  "contact_name": null,
  "contact_email": null,
  "contact_phone": null,
  "created_at": "2025-12-26T18:38:57+00:00",
  "updated_at": "2025-12-26T18:39:09+00:00",
  "created_by_user_id": "system"
}
```

**`company_id` 71108**

```json
{
  "company_id": "71108",
  "company_name": "Grenton",
  "industry": "YouTube/Media",
  "website": "https://youtube.com/channel/291716",
  "logo_url": null,
  "description": null,
  "status": "active",
  "company_size": null,
  "location": null,
  "source": null,
  "notes": null,
  "contact_name": null,
  "contact_email": null,
  "contact_phone": null,
  "created_at": "2025-03-05T17:40:59+00:00",
  "updated_at": "2025-03-05T17:46:08+00:00",
  "created_by_user_id": "system"
}
```

**`company_id` 82276**

```json
{
  "company_id": "82276",
  "company_name": "Signature Framework",
  "industry": "YouTube/Media",
  "website": "mysnapshot.co",
  "logo_url": "company_images/175034730182276.jpg",
  "description": "I help experts turn their expertise into a framework that clicks.\r\n\r\nWe distill their unique approach into a proprietary framework and create the branded visuals they need to share, teach, and sell across all platforms.",
  "status": "active",
  "company_size": null,
  "location": null,
  "source": null,
  "notes": null,
  "contact_name": null,
  "contact_email": null,
  "contact_phone": null,
  "created_at": "2025-06-19T15:32:52+00:00",
  "updated_at": "2025-07-04T04:00:05+00:00",
  "created_by_user_id": "system"
}
```

---

## 3. Pipeline dataset — a legacy recruiting dataset (reference only)

> Documents an **existing legacy pipeline dataset** (contract-centric). **Not** the template schema — the target is `DATABASE_SCHEMA.md` (`platform.jobs` keys off `company_account_id`, not `contract_id`).

The catalog tables (same content as the Postgres copy above) plus the full recruiting pipeline.

### 3.1 Table inventory

| Table | Notes |
|---|---|
| `talents` · `companies` | catalog copies — same content as the Postgres tables |
| **`jobs`** | job records — example records below |
| `talent_searches` | saved talent searches |
| `contracts` | engagement deals — example records below |
| `attachments` · `contacts` · `job_search_assignments` · `job_searches` · `recruiter_users` | supporting records |
| `candidates` · `contract_assignments` · `job_assignments` · `messages` · `outreach_activities` · `pipeline` · `saved_searches` · `search_targets` · `searches` · `shortlist` · `talent_shortlists` | scaffolding — verify contents before relying on them |

### 3.2 `jobs` — schema

```text
job_id             STRING REQUIRED      contract_id        STRING REQUIRED
job_title          STRING REQUIRED      description       STRING
requirements       STRING               compensation_min  FLOAT
compensation_max   FLOAT                location_type     STRING
location           STRING               target_start_date STRING
priority           STRING               status            STRING
filled_date        STRING               placed_candidate_id STRING
notes              STRING               created_at        TIMESTAMP REQUIRED
updated_at         TIMESTAMP REQUIRED   created_by_user_id STRING
engagement_type    STRING               fee_amount        FLOAT
search_criteria    JSON
```

### 3.3 `jobs` — example records

| job_id | job_title | contract | status | priority | type | fee | created (UTC) |
|---|---|---|---|---|---|---|---|
| `3bf34ab8…02ad1` | Senior Video Editor 18:45:23 | Unknown — Senior Video Editor | draft | high | — | — | 2026-02-04 02:45 |
| `574ab56b…cca4f` | Director of Media Operations | Owner.com Recruitment | draft | medium | contingent | — | 2026-02-04 23:32 |
| `9f4cb3bd…186c` | Short-Form Content Manager | Owner.com Recruitment | draft | medium | contingent | — | 2026-02-04 23:32 |
| `45bb2f16…59b6c` | YouTube Editor | Owner.com Recruitment | **active** | medium | contingent | $4,000 | 2026-02-04 23:32 |

**Complete record — a job with a populated `search_criteria` (the criteria JSON contract):**

```json
{
  "job_id": "574ab56b-b57c-40ba-838a-2306a93cca4f",
  "contract_id": "e9da18e1-b518-4693-a3f7-2d0434e5fd9b",
  "job_title": "Director of Media Operations",
  "description": "",
  "engagement_type": "contingent",
  "location_type": "remote",
  "priority": "medium",
  "status": "draft",
  "created_by_user_id": "system",
  "created_at": "2026-02-04 23:32:02",
  "updated_at": "2026-02-05 04:06:38",
  "search_criteria": {
    "keyword": "Media Operations",
    "skills": ["Adobe After Effects", "Adobe Photoshop", "Adobe Premiere Pro",
               "Canva", "DaVinci Resolve", "Frame.io", "Figma", "Final Cut Pro"],
    "has_portfolio": true, "has_videos": true,
    "hire_me_availability_full_time": true, "hire_me_location_remote": true,
    "countries": [], "states": [], "cities": [], "styles": [],
    "verified": false, "youtube_verified": false
  }
}
```

### 3.4 Related records — `contracts` and `job_searches`

| contract_id | contract_name | company_id | status | stage | fee | created |
|---|---|---|---|---|---|---|
| `ae3d7938…48d9` | Unknown — Senior Video Editor | `a711e728…8322` | draft | in_progress | — | 2026-02-04 |
| `e9da18e1…fd9b` | Owner.com Recruitment | `14a4b150…5d68` | draft | prospect | $25,000 | 2026-02-04 |

`job_searches` (the legacy pre-refactor table) can hold the same job duplicated across the old and new table generations — deduplicate when reading.

### 3.5 Guidance

1. **Expect seed/test records in the pipeline tables** — created by a system actor during setup, not real recruiting activity. A job title with an embedded timestamp is a telltale test artifact.
2. **Verify pipeline contents before building on them** — the scaffolding may never have been used in production.
3. **The `search_criteria` stored is the flat format** — the runtime format, not any nested documentation format. Build against the flat contract.
4. **The catalog tables in the pipeline dataset mirror the Postgres copy** — treat Postgres as the single home for catalog data.
