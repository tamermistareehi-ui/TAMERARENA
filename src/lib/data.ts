import { db } from "@/db";
import { projects, certificates, settings } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { DRIVE_CATEGORIES, driveFileUrl, driveThumbnailUrl } from "./drive";

export const DEFAULT_SETTINGS: Record<string, string> = {
  name: "تامر مستريحي",
  nameEn: "Tamer Mistareehi",
  title: "مهندس ومصمم ذكاء اصطناعي توليدي",
  titleEn: "Generative AI Engineer & Designer",
  avatar: "/images/avatar.jpg",
  bio: "أعمل عند نقطة التقاء الهندسة والفن؛ أبني أنظمة ذكاء اصطناعي توليدي (LLMs، Diffusion Models، Agents) وأصمم تجارب بصرية وتفاعلية تُترجم قدرات هذه النماذج إلى منتجات حقيقية. شغفي هو تحويل الأفكار المعقّدة إلى حلول ذكية وجميلة وقابلة للاستخدام.",
  email: "tamermistareehi@gmail.com",
  location: "Middle East · Remote",
  yearsExp: "5+",
  projectsCount: "40+",
  modelsCount: "25+",
};

type DriveSeed = {
  title: string;
  category: string;
  id: string;
  fileType: "image" | "video" | "audio" | "presentation";
  fileName: string;
  order: number;
  description: string;
  tags: string;
  featured?: boolean;
  cover?: string;
};

function makeDriveProject(item: DriveSeed) {
  const isVisual = item.fileType === "image" || item.fileType === "video";
  return {
    title: item.title,
    description: item.description,
    category: item.category,
    imageUrl: isVisual ? driveThumbnailUrl(item.id) : item.cover || "/images/p6.jpg",
    fileType: item.fileType,
    fileName: item.fileName,
    link: driveFileUrl(item.id),
    tags: item.tags,
    featured: item.featured ?? false,
    sortOrder: item.order,
  };
}

const SEED_PROJECTS = [
  // صور — 10 files
  makeDriveProject({
    title: "1758299404046.jpg_202609081047.jpeg",
    fileName: "1758299404046.jpg_202609081047.jpeg",
    category: "صور",
    id: "13rb5vFedGqVFMhk0tK6RKyxtRFQkOPAL",
    fileType: "image",
    order: 1,
    description: "عمل بصري مولّد بالذكاء الاصطناعي من مجموعة الصور الإبداعية.",
    tags: "Drive,AI Art,Image",
    featured: true,
  }),
  makeDriveProject({
    title: "2.jpeg",
    fileName: "2.jpeg",
    category: "صور",
    id: "1FZzbppbicuxz_AGtKiXa3UH0zXkq-TUO",
    fileType: "image",
    order: 2,
    description: "صورة إبداعية من أرشيف الأعمال البصرية.",
    tags: "Drive,Creative,Image",
  }),
  makeDriveProject({
    title: "Army marching across desert",
    fileName: "Army_marching_across_desert_202609071445.jpeg",
    category: "صور",
    id: "13HdsCD5yAVwvRL323OdDMWzJuR1EOHE9",
    fileType: "image",
    order: 3,
    description: "مشهد سردي مولّد بالذكاء الاصطناعي مع معالجة سينمائية.",
    tags: "Generative Art,Cinematic,Image",
  }),
  makeDriveProject({
    title: "Army returning to Medina",
    fileName: "Army_returning_to_Medina_city_202609071451.jpeg",
    category: "صور",
    id: "1yObOXr4RPeUWAxh-5_cXGdSw5OTfH2x8",
    fileType: "image",
    order: 4,
    description: "تكوين بصري قصصي من سلسلة المشاهد التاريخية التوليدية.",
    tags: "AI Storytelling,Image,Drive",
  }),
  makeDriveProject({
    title: "Army returning to Medina — variation",
    fileName: "Army_returning_to_Medina_city_202609071451.jpeg_202609071457.jpeg",
    category: "صور",
    id: "1eDeVDTSGD5iSGj2CzIFVNTbdjK71qOkO",
    fileType: "image",
    order: 5,
    description: "نسخة بديلة من المشهد مع إضاءة وتكوين مختلفين.",
    tags: "Generative Art,Variation,Image",
  }),
  makeDriveProject({
    title: "Design Arena",
    fileName: "designarena_image_ruxncmv0.png",
    category: "صور",
    id: "1JiOyHoJ3yL3oHMu1EzJkpOKZ2iIMqr_G",
    fileType: "image",
    order: 6,
    description: "هوية ومشهد بصري مستكشف عبر أدوات التصميم التوليدي.",
    tags: "Design,AI Art,PNG",
  }),
  makeDriveProject({
    title: "Hunter catching cloud birds",
    fileName: "Hunter_catching_cloud_birds_20260910104058.jpeg",
    category: "صور",
    id: "1tallM5fQFUdpkNdAcMH-XlIemtuaQmMQ",
    fileType: "image",
    order: 7,
    description: "مشهد خيالي بتفاصيل توليدية وشخصية سردية واضحة.",
    tags: "Fantasy,Generative Art,Image",
  }),
  makeDriveProject({
    title: "Hunter catching cloud birds — variation",
    fileName: "Hunter_catching_cloud_birds_20260910104149.jpeg",
    category: "صور",
    id: "1hp-8a1I8J2ok4bTmt-h41LRebB7MeAcX",
    fileType: "image",
    order: 8,
    description: "نسخة بديلة من مشهد الصياد والطيور السحابية.",
    tags: "Fantasy,Variation,Image",
  }),
  makeDriveProject({
    title: "تامر مستريحي — portrait",
    fileName: "تامر مستريحي 2.png",
    category: "صور",
    id: "124rQ79F8osHV1O-pqNIgNPvSERp_gkaR",
    fileType: "image",
    order: 9,
    description: "صورة شخصية من مجلد الأعمال البصرية.",
    tags: "Portrait,Personal,PNG",
    featured: true,
  }),
  makeDriveProject({
    title: "حروف عربية بتصميم فرسان",
    fileName: "حروف_عربية_بتصميم_فرسان_202609071333.jpeg",
    category: "صور",
    id: "1i_0nZf6lijJ11ijky-xcXfRfyxszcdQQ",
    fileType: "image",
    order: 10,
    description: "تجربة بصرية تجمع الحروف العربية بالخيال التوليدي.",
    tags: "Arabic,Typography,AI Art",
  }),

  // افتار — 2 videos
  makeDriveProject({
    title: "تامر — معهد الرمثا",
    fileName: "تامر - معهد الرمثا.mp4",
    category: "افتار",
    id: "17FlhS0C8Q_WI6_6bX3yMwLiuU3LB23OI",
    fileType: "video",
    order: 1,
    description: "فيديو افتار متحرك من مجموعة الهوية الشخصية.",
    tags: "Avatar,Video,Drive",
    featured: true,
  }),
  makeDriveProject({
    title: "فيديو بدون عنوان — avatar",
    fileName: "فيديو بدون عنوان (1) (1).MP4",
    category: "افتار",
    id: "176Spj_lPqzIzxxhO2y4SAKO-H6mbYcul",
    fileType: "video",
    order: 2,
    description: "تجربة فيديو افتار ثانية من مجلد الهوية المتحركة.",
    tags: "Avatar,Motion,MP4",
  }),

  // إعلانات — 8 files
  makeDriveProject({
    title: "Data entry poster",
    fileName: "data_entry_poster.jpg",
    category: "اعلانات",
    id: "17GR-2VPfBR0U_s8mX9FIiWpNzigArDWD",
    fileType: "image",
    order: 1,
    description: "ملصق إعلاني مصمم لحملة خدمات إدخال البيانات.",
    tags: "Advertising,Poster,JPG",
    featured: true,
  }),
  makeDriveProject({
    title: "Gemini generated campaign image",
    fileName: "Gemini_Generated_Image_simjovsimjovsimj.jpg",
    category: "اعلانات",
    id: "1txhpx7PFqdpWBbQO1btoTwUv5okL1Im5",
    fileType: "image",
    order: 2,
    description: "صورة حملة إعلانية مولّدة باستخدام Gemini.",
    tags: "Gemini,Advertising,Image",
  }),
  makeDriveProject({
    title: "Luxury mall smart lockers",
    fileName: "luxury_mall_smart_lockers.jpg",
    category: "اعلانات",
    id: "1eRn0N7uXiMnhWMxW4RPqoqUbyi-LtdpL",
    fileType: "image",
    order: 3,
    description: "تصور إعلاني لخزائن ذكية داخل مركز تجاري فاخر.",
    tags: "Commercial,Smart Lockers,Image",
  }),
  makeDriveProject({
    title: "تصميم إعلان منصة lychee",
    fileName: "lychee-v0_a_قم_بتصميم_صورة_عن_مد.png",
    category: "اعلانات",
    id: "10sMJ380ut26m9Awv6Q-74vqcqHLbjGQX",
    fileType: "image",
    order: 4,
    description: "تصميم إعلان تجريبي باللغة العربية.",
    tags: "Arabic Ad,Design,PNG",
  }),
  makeDriveProject({
    title: "Smart lockers — commercial storyboard",
    fileName: "Smart_lockers_commercial_storyboard_202609081138.mp4",
    category: "اعلانات",
    id: "1GzfpKoHNXj2fjXj0jt5xKnXveinBfUMP",
    fileType: "video",
    order: 5,
    description: "قصة مصورة متحركة لإعلان الخزائن الذكية.",
    tags: "Storyboard,Commercial,Video",
    featured: true,
  }),
  makeDriveProject({
    title: "إعلان للشركة",
    fileName: "اعلان للشركة.mp4",
    category: "اعلانات",
    id: "1f2b7EAg4Odr9n7eFU8H409drvEYFB8oO",
    fileType: "video",
    order: 6,
    description: "فيديو إعلاني للشركة من أرشيف الأعمال.",
    tags: "Commercial,Arabic,MP4",
  }),
  makeDriveProject({
    title: "تامر 2",
    fileName: "تامر 2.jpeg",
    category: "اعلانات",
    id: "1IqISbFZUx-_P7RIpHO6u7T62rLQJ2GQv",
    fileType: "image",
    order: 7,
    description: "إطار بصري من حملة إعلانية شخصية.",
    tags: "Campaign,Portrait,Image",
  }),
  makeDriveProject({
    title: "مجموعة 3",
    fileName: "مجموعه 3.png",
    category: "اعلانات",
    id: "18dNYP0EPDJz7776j66F0TL4JTEtem4WH",
    fileType: "image",
    order: 8,
    description: "مجموعة تصاميم إعلانية جاهزة للاستعراض.",
    tags: "Campaign,Collection,PNG",
  }),

  // صوتيات — 1 file
  makeDriveProject({
    title: "حارس سحاب التنانين",
    fileName: "حارس_سحاب_التنانين.mp3",
    category: "صوتيات",
    id: "14AxDW0nmRYbOTmelfm1VUl459i_tEgF5",
    fileType: "audio",
    order: 1,
    description: "قطعة صوتية من أرشيف التجارب الصوتية التوليدية.",
    tags: "Audio,Sound Design,MP3",
    cover: "/images/p6.jpg",
    featured: true,
  }),

  // عروض تقديمية — 1 file
  makeDriveProject({
    title: "الذكاء الاصطناعي — أدوات الابتكار والإبداع",
    fileName: "الذكاء الاصطناعي - أدوات الابتكار والإبداع تامر مستريحي.pptx",
    category: "عروض تقديمية",
    id: "1D1N7PojZjg1qVLrwdxX2nwgUTrMqiXRz",
    fileType: "presentation",
    order: 1,
    description: "عرض تقديمي عن أدوات الذكاء الاصطناعي للابتكار والإبداع.",
    tags: "AI,Presentation,Innovation",
    cover: "/images/p5.jpg",
    featured: true,
  }),
];

const SEED_CERTS = [
  { title: "Generative AI with Large Language Models", issuer: "DeepLearning.AI × AWS", year: "2024", sortOrder: 1 },
  { title: "Prompt Engineering for Developers", issuer: "DeepLearning.AI", year: "2024", sortOrder: 2 },
  { title: "Deep Learning Specialization", issuer: "Coursera · Andrew Ng", year: "2023", sortOrder: 3 },
  { title: "Stable Diffusion & Diffusion Models Masterclass", issuer: "Hugging Face", year: "2023", sortOrder: 4 },
  { title: "Google UX Design Professional Certificate", issuer: "Google", year: "2022", sortOrder: 5 },
  { title: "Machine Learning Engineering for Production (MLOps)", issuer: "DeepLearning.AI", year: "2023", sortOrder: 6 },
];

let seeded = false;
let seeding: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (seeded) return Promise.resolve();
  if (!seeding) {
    seeding = runSeed().finally(() => {
      seeding = null;
    });
  }
  return seeding;
}

async function runSeed() {
  try {
    const existing = await db.select({ id: projects.id }).from(projects).limit(1);
    if (existing.length === 0) {
      await db.insert(projects).values(SEED_PROJECTS);
    }
    const certs = await db.select({ id: certificates.id }).from(certificates).limit(1);
    if (certs.length === 0) {
      await db.insert(certificates).values(SEED_CERTS);
    }
    const s = await db.select().from(settings).limit(1);
    if (s.length === 0) {
      await db
        .insert(settings)
        .values(Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })));
    }
    seeded = true;
  } catch (e) {
    console.error("seed failed", e);
  }
}

export async function getProjects() {
  await ensureSeeded();
  return db.select().from(projects).orderBy(asc(projects.category), asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getCertificates() {
  await ensureSeeded();
  return db.select().from(certificates).orderBy(asc(certificates.sortOrder), desc(certificates.createdAt));
}

export async function getSettings(): Promise<Record<string, string>> {
  await ensureSeeded();
  const rows = await db.select().from(settings);
  const out = { ...DEFAULT_SETTINGS };
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function setSetting(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export type Project = typeof projects.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export { DRIVE_CATEGORIES };
