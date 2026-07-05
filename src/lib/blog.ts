export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  gradient: string;
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: "ahamiat-automation-sazmani",
    title: "چرا اتوماسیون سازمانی برای کسب‌وکار شما ضروری است؟",
    excerpt:
      "بررسی مزایای دیجیتالی‌سازی فرآیندهای اداری و تأثیر آن بر کاهش هزینه و افزایش دقت تصمیم‌گیری.",
    content:
      "اتوماسیون سازمانی یکی از سریع‌ترین راه‌ها برای افزایش بهره‌وری تیم‌هاست. با حذف فرآیندهای کاغذی و دستی، سازمان‌ها می‌توانند زمان بیشتری را صرف تصمیم‌گیری‌های راهبردی کنند و خطاهای انسانی را به‌طور چشمگیری کاهش دهند.",
    date: "۱۴۰۴/۰۴/۰۱",
    author: "تیم محتوای نهان آریا",
    tags: ["اتوماسیون", "بهره‌وری"],
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    slug: "estelam-code-melli-chist",
    title: "استعلام کد ملی چگونه امنیت کسب‌وکار آنلاین شما را افزایش می‌دهد؟",
    excerpt:
      "معرفی وب‌سرویس صحت‌سنجی کد ملی و کاربردهای آن در ثبت‌نام آنلاین و درگاه‌های مالی.",
    content:
      "یکی از چالش‌های اصلی کسب‌وکارهای آنلاین، احراز هویت صحیح کاربران است. استفاده از سرویس صحت‌سنجی کد ملی به شما کمک می‌کند از ثبت‌نام‌های جعلی جلوگیری کرده و اعتماد کاربران را جلب کنید.",
    date: "۱۴۰۴/۰۳/۲۰",
    author: "تیم محتوای نهان آریا",
    tags: ["امنیت", "احراز هویت"],
    gradient: "from-amber-500 to-orange-600",
  },
  {
    slug: "entekhab-model-eshterak-monaseb",
    title: "چگونه مدل اشتراکی مناسب کسب‌وکار خود را انتخاب کنیم؟",
    excerpt: "راهنمای انتخاب پلن اشتراک نرم‌افزاری متناسب با اندازه و نیاز کسب‌وکار شما.",
    content:
      "مدل‌های اشتراکی (SaaS) به کسب‌وکارها اجازه می‌دهند بدون سرمایه‌گذاری اولیه سنگین، از امکانات نرم‌افزاری روز بهره‌مند شوند. انتخاب پلن مناسب نیازمند بررسی دقیق نیازهای فعلی و رشد آینده کسب‌وکار است.",
    date: "۱۴۰۴/۰۳/۰۵",
    author: "تیم محتوای نهان آریا",
    tags: ["اشتراک", "SaaS"],
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    slug: "seo-baraye-site-forushgahi",
    title: "نکات کلیدی سئو برای فروشگاه‌های اینترنتی",
    excerpt: "چند اصل مهم برای بهبود رتبه فروشگاه اینترنتی شما در نتایج جستجو.",
    content:
      "سرعت بارگذاری صفحات، ساختار مناسب URL، متادیتای دقیق و محتوای باکیفیت از مهم‌ترین عواملی هستند که بر رتبه فروشگاه اینترنتی شما در موتورهای جستجو تأثیر می‌گذارند.",
    date: "۱۴۰۴/۰۲/۱۸",
    author: "تیم محتوای نهان آریا",
    tags: ["سئو", "فروشگاه اینترنتی"],
    gradient: "from-rose-500 to-pink-600",
  },
  {
    slug: "amniat-etelaat-sazmani",
    title: "پنج اصل اساسی برای محافظت از اطلاعات سازمانی",
    excerpt: "معرفی اصول پایه امنیت اطلاعات که هر سازمانی باید رعایت کند.",
    content:
      "رمزنگاری داده‌ها، مدیریت دسترسی کاربران، پشتیبان‌گیری منظم، به‌روزرسانی مستمر سیستم‌ها و آموزش کارکنان از اصول پایه‌ای هستند که امنیت اطلاعات سازمان شما را تضمین می‌کنند.",
    date: "۱۴۰۴/۰۱/۳۰",
    author: "تیم محتوای نهان آریا",
    tags: ["امنیت اطلاعات"],
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    slug: "startup-mvp-che-hast",
    title: "MVP چیست و چرا استارتاپ شما به آن نیاز دارد؟",
    excerpt: "آشنایی با مفهوم محصول حداقلی و نقش آن در کاهش ریسک استارتاپ‌ها.",
    content:
      "ساخت نسخه حداقلی قابل ارائه از محصول (MVP) به استارتاپ‌ها کمک می‌کند تا با کمترین هزینه و زمان، فرضیات کسب‌وکار خود را در بازار واقعی بسنجند و مسیر توسعه محصول را با اطمینان بیشتری ادامه دهند.",
    date: "۱۴۰۳/۱۲/۱۵",
    author: "تیم محتوای نهان آریا",
    tags: ["استارتاپ", "MVP"],
    gradient: "from-sky-500 to-blue-600",
  },
];

function normalizePost(raw: Record<string, unknown>, index: number): BlogPost {
  const fallback = FALLBACK_POSTS[index % FALLBACK_POSTS.length];
  return {
    slug: typeof raw.slug === "string" ? raw.slug : fallback.slug,
    title: typeof raw.title === "string" ? raw.title : fallback.title,
    excerpt: typeof raw.excerpt === "string" ? raw.excerpt : fallback.excerpt,
    content: typeof raw.content === "string" ? raw.content : fallback.content,
    date: typeof raw.date === "string" ? raw.date : fallback.date,
    author: typeof raw.author === "string" ? raw.author : fallback.author,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : fallback.tags,
    gradient: typeof raw.gradient === "string" ? raw.gradient : fallback.gradient,
  };
}

/**
 * Blog content is designed to be served by an external/decoupled blog API.
 * Set BLOG_API_URL to point this at that service; until then, curated
 * fallback posts keep the blog section fully functional.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const apiUrl = process.env.BLOG_API_URL;
  if (apiUrl) {
    try {
      const res = await fetch(apiUrl, { next: { revalidate: 300 } });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.posts;
        if (Array.isArray(list) && list.length > 0) {
          return list.map((item, i) => normalizePost(item, i));
        }
      }
    } catch {
      // در صورت خطا در دسترسی به API خارجی، از محتوای پیش‌فرض استفاده می‌شود
    }
  }
  return FALLBACK_POSTS;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}
