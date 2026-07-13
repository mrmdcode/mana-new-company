import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "مستندات API درگاه پرداخت",
  description: "راهنمای فنی اتصال به درگاه پرداخت اسرار نهان برای توسعه‌دهندگان.",
  alternates: { canonical: "/docs/gateway" },
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      dir="ltr"
      className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100 dark:border-white/10"
    >
      <code>{children}</code>
    </pre>
  );
}

function FieldsTable({
  rows,
}: {
  rows: { name: string; type: string; required: boolean; description: string }[];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
      <table className="w-full min-w-[560px] text-start text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <tr>
            <th className="px-4 py-2.5 text-start font-semibold">فیلد</th>
            <th className="px-4 py-2.5 text-start font-semibold">نوع</th>
            <th className="px-4 py-2.5 text-start font-semibold">الزامی</th>
            <th className="px-4 py-2.5 text-start font-semibold">توضیح</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {rows.map((row) => (
            <tr key={row.name}>
              <td dir="ltr" className="px-4 py-2.5 text-end font-mono text-slate-800 dark:text-slate-200">
                {row.name}
              </td>
              <td dir="ltr" className="px-4 py-2.5 text-end text-slate-500 dark:text-slate-400">
                {row.type}
              </td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row.required ? "بله" : "خیر"}</td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-slate-100 py-10 dark:border-white/5">
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  );
}

export default function GatewayDocsPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-100 bg-slate-50 py-16 dark:border-white/5 dark:bg-slate-900/40 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="مستندات فنی"
            title="مستندات API درگاه پرداخت"
            description="راهنمای اتصال سایت‌های دیگر به درگاه پرداخت اسرار نهان (متصل به زرین‌پال)."
          />
        </Container>
      </section>

      <Container className="max-w-3xl py-12">
        <Section id="intro" title="۱. مقدمه">
          <p>
            برای استفاده از این درگاه، ابتدا باید در پنل مدیریت اسرار نهان برای کسب‌وکار شما یک «دامنه» ثبت شود.
            پس از ثبت، یک <code dir="ltr">merchant_id</code> اختصاصی در اختیار شما قرار می‌گیرد که در تمام
            درخواست‌های زیر باید ارسال شود. مبلغ در تمام endpointها به <strong>تومان</strong> است.
          </p>
        </Section>

        <Section id="request" title="۲. ساخت درخواست پرداخت">
          <p>
            برای شروع یک پرداخت، درخواست زیر را از سمت سرور خودتان ارسال کنید:
          </p>
          <p dir="ltr" className="font-mono text-slate-800 dark:text-slate-200">
            POST {siteConfig.url}/api/gateway/payment/request
          </p>

          <FieldsTable
            rows={[
              { name: "merchant_id", type: "string", required: true, description: "merchantID دریافتی از اسرار نهان" },
              { name: "amount", type: "integer", required: true, description: "مبلغ به تومان (عدد صحیح مثبت)" },
              { name: "description", type: "string", required: false, description: "توضیح تراکنش" },
              { name: "mobile", type: "string", required: false, description: "شماره موبایل خریدار" },
              {
                name: "callback_url",
                type: "string",
                required: true,
                description: "آدرسی که پس از پرداخت، کاربر و نتیجه نهایی به آن برمی‌گردد",
              },
            ]}
          />

          <p className="font-semibold text-slate-800 dark:text-slate-100">نمونه درخواست:</p>
          <CodeBlock>{`curl -X POST ${siteConfig.url}/api/gateway/payment/request \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_id": "MERCHANT_ID",
    "amount": 250000,
    "description": "خرید اشتراک",
    "mobile": "09120000000",
    "callback_url": "https://your-site.com/payment/callback?order_id=123"
  }'`}</CodeBlock>

          <p className="font-semibold text-slate-800 dark:text-slate-100">نمونه پاسخ موفق (HTTP 201):</p>
          <CodeBlock>{`{
  "authority": "A00000000000000000000000000000wwOGYpd",
  "pay_url": "${siteConfig.url}/pay/A00000000000000000000000000000wwOGYpd"
}`}</CodeBlock>

          <p>
            کاربر را به <code dir="ltr">pay_url</code> ریدایرکت کنید. این آدرس مستقیم او را به صفحه واقعی پرداخت
            زرین‌پال می‌برد.
          </p>
        </Section>

        <Section id="flow" title="۳. جریان کامل پرداخت">
          <ol className="list-decimal space-y-2 pe-5">
            <li>سایت شما درخواست پرداخت را می‌سازد و کاربر را به <code dir="ltr">pay_url</code> می‌فرستد.</li>
            <li>کاربر روی صفحه واقعی زرین‌پال، پرداخت را انجام می‌دهد.</li>
            <li>زرین‌پال نتیجه را به اسرار نهان برمی‌گرداند و ما آن را نزد زرین‌پال Verify می‌کنیم.</li>
            <li>
              مرورگر کاربر به همان <code dir="ltr">callback_url</code>ای که در مرحله ۱ داده بودید ریدایرکت
              می‌شود، با query paramهای <code dir="ltr">authority</code>، <code dir="ltr">status</code> و{" "}
              <code dir="ltr">ref_id</code>.
            </li>
            <li>
              هم‌زمان یک درخواست POST (وب‌هوک) با همین اطلاعات مستقیم به همان <code dir="ltr">callback_url</code>{" "}
              ارسال می‌شود؛ برای اطمینان بیشتر، به وب‌هوک هم اعتماد کنید نه فقط ریدایرکت مرورگر.
            </li>
          </ol>

          <p className="font-semibold text-slate-800 dark:text-slate-100">نمونه ریدایرکت/وب‌هوک:</p>
          <CodeBlock>{`GET https://your-site.com/payment/callback?order_id=123&authority=A00...&status=paid&ref_id=123456

POST https://your-site.com/payment/callback
{
  "authority": "A00000000000000000000000000000wwOGYpd",
  "status": "paid",
  "amount": 250000,
  "ref_id": "123456"
}`}</CodeBlock>
        </Section>

        <Section id="status" title="۴. مقادیر وضعیت">
          <FieldsTable
            rows={[
              { name: "pending", type: "status", required: false, description: "هنوز پرداخت انجام یا نهایی نشده" },
              { name: "paid", type: "status", required: false, description: "پرداخت با موفقیت انجام و تایید شد" },
              { name: "failed", type: "status", required: false, description: "پرداخت ناموفق بود یا لغو شد" },
            ]}
          />
        </Section>

        <Section id="verify" title="۵. استعلام وضعیت">
          <p>
            برای اطمینان از وضعیت نهایی یک تراکنش (مثلا اگر وب‌هوک به هر دلیلی دریافت نشد)، می‌توانید در هر
            زمان این endpoint را صدا بزنید:
          </p>
          <p dir="ltr" className="font-mono text-slate-800 dark:text-slate-200">
            POST {siteConfig.url}/api/gateway/payment/verify
          </p>

          <CodeBlock>{`curl -X POST ${siteConfig.url}/api/gateway/payment/verify \\
  -H "Content-Type: application/json" \\
  -d '{ "merchant_id": "MERCHANT_ID", "authority": "A00000000000000000000000000000wwOGYpd" }'`}</CodeBlock>

          <p className="font-semibold text-slate-800 dark:text-slate-100">نمونه پاسخ:</p>
          <CodeBlock>{`{
  "status": "paid",
  "amount": 250000,
  "authority": "A00000000000000000000000000000wwOGYpd",
  "ref_id": "123456"
}`}</CodeBlock>
        </Section>

        <Section id="errors" title="۶. خطاها">
          <FieldsTable
            rows={[
              { name: "400", type: "HTTP", required: false, description: "فیلد الزامی ارسال نشده یا نامعتبر است" },
              { name: "404", type: "HTTP", required: false, description: "merchant_id/authority یافت نشد یا درگاه غیرفعال است" },
              { name: "502", type: "HTTP", required: false, description: "خطا در ارتباط با زرین‌پال" },
            ]}
          />
          <p>در تمام خطاها بدنه پاسخ به شکل <code dir="ltr">{`{ "error": "..." }`}</code> است.</p>
        </Section>

        <Section id="notes" title="۷. نکات مهم">
          <ul className="list-disc space-y-2 pe-5">
            <li>مبلغ همیشه به <strong>تومان</strong> است، نه ریال.</li>
            <li><code dir="ltr">callback_url</code> باید یک آدرس معتبر و در دسترس (http/https) باشد.</li>
            <li>هر <code dir="ltr">authority</code> فقط یک‌بار پردازش می‌شود؛ درخواست‌های تکراری همان نتیجه قبلی را برمی‌گردانند.</li>
            <li>برای دریافت merchant_id، از طریق راه‌های تماس با ما درخواست بدهید.</li>
          </ul>
        </Section>
      </Container>
    </div>
  );
}
