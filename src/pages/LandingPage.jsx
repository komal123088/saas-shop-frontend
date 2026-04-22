import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Zap,
  Shield,
  Users,
  BarChart2,
  Package,
  ArrowRight,
  X,
  ChevronDown,
  Clock,
  Headphones,
  TrendingUp,
  Star,
  Menu,
} from "lucide-react";
import api from "../api/api";
import { API_ENDPOINTS } from "../api/EndPoints";

// const API_URL = `${import.meta.env.VITE_REACT_BACKEND_BASE}/saas`;

const PLAN_META = {
  normal: {
    tag: null,
    accent: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
    badge: null,
  },
  standard: {
    tag: "Most Popular",
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    badge: "popular",
  },
  premium: {
    tag: "Best Value",
    accent: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#b45309",
    badge: "best",
  },
};

const FEATURES = [
  {
    icon: BarChart2,
    title: "Sales Reports",
    desc: "Daily, weekly and monthly reports with one click.",
  },
  {
    icon: Package,
    title: "Inventory Control",
    desc: "Alerts before stock runs out, real-time updates.",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    desc: "Separate logins for Admin, Manager, Cashier.",
  },
  {
    icon: Shield,
    title: "Data Isolation",
    desc: "Your data belongs only to you — no one else can see it.",
  },
  {
    icon: Zap,
    title: "Instant Billing",
    desc: "Fast and easy billing — reduce customer queue time.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Any issue? We're always here to help.",
  },
];

const FAQS = [
  {
    q: "How long does it take to get access after registering?",
    a: "After submitting registration, our team reviews it within 24 hours. Once approved, you will receive login details via email.",
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Yes, absolutely! You can upgrade anytime. Just contact admin and they will handle the upgrade.",
  },
  {
    q: "Is my data secure?",
    a: "Yes, every shop's data is stored in a completely separate database. No other shop can access your data.",
  },
  {
    q: "How many employees can I add?",
    a: "Depends on the plan — Normal: 3, Standard: 10, Premium: unlimited employees.",
  },
];

const STEPS = [
  {
    step: "01",
    icon: TrendingUp,
    title: "Choose a Plan",
    desc: "Select Normal, Standard or Premium plan according to your needs.",
  },
  {
    step: "02",
    icon: Users,
    title: "Fill the Form",
    desc: "Enter basic details of your shop — takes only 2 minutes.",
  },
  {
    step: "03",
    icon: Clock,
    title: "Wait for Approval",
    desc: "Our team will review and approve within 24 hours.",
  },
  {
    step: "04",
    icon: Zap,
    title: "Start Using!",
    desc: "You'll receive login details via email. Just log in and begin.",
  },
];

export default function LandingPage() {
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
  });
  const plansRef = useRef(null);

  useEffect(() => {
    api
      .get(API_ENDPOINTS.PLANS)
      .then((r) => setPlans(r.data))
      .catch(() => toast.error("Plans not load, Please refresh"))
      .finally(() => setPlansLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const scrollToPlans = () =>
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  const openRegister = (plan) => {
    setSelectedPlan(plan);
    setSubmitted(false);
    setForm({ shopName: "", ownerName: "", email: "", phone: "" });
    setShowForm(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { shopName, ownerName, email, phone } = form;
    if (!shopName || !ownerName || !email || !phone)
      return toast.error("Please fill all fields");
    setSubmitting(true);
    try {
      await api.post(API_ENDPOINTS.SAAS_REGISTER, {
        ...form,
        planId: selectedPlan._id,
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed, please try again",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const meta = selectedPlan
    ? PLAN_META[selectedPlan.name] || PLAN_META.normal
    : {};

  return (
    <>
      <style>{`
        /* ── same CSS as you provided ── no changes here ── */
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,800;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --teal: #0d9488; --teal-d: #0f766e; --teal-l: #f0fdfa; --teal-m: #99f6e4;
          --text1: #0f172a; --text2: #475569; --text3: #94a3b8;
          --bg: #f8fafc; --white: #ffffff; --border: #e2e8f0;
          --shadow: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
        }

        body { font-family: 'Outfit', sans-serif; color: var(--text1); background: var(--white); -webkit-font-smoothing: antialiased; }

        /* NAV */
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 5%;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark {
          width: 36px; height: 36px; background: var(--teal); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-weight: 800; font-size: 18px; color: #fff;
          box-shadow: 0 3px 10px rgba(13,148,136,0.3);
        }
        .nav-brand { font-family: 'Fraunces', serif; font-weight: 700; font-size: 18px; color: var(--text1); }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { font-size: 14px; font-weight: 500; color: var(--text2); text-decoration: none; transition: color 0.14s; }
        .nav-links a:hover { color: var(--teal); }
        .nav-cta {
          padding: 8px 18px; border-radius: 9px; background: var(--teal); color: #fff;
          font-size: 13.5px; font-weight: 600; border: none; cursor: pointer;
          transition: background 0.14s; font-family: 'Outfit', sans-serif;
          box-shadow: 0 2px 8px rgba(13,148,136,0.3);
        }
        .nav-cta:hover { background: var(--teal-d); }
        .nav-mob { display: none; width: 36px; height: 36px; border: 1px solid var(--border); background: #fff; border-radius: 8px; cursor: pointer; align-items: center; justify-content: center; color: var(--text2); }

        /* HERO */
        .hero {
          padding: 90px 5% 80px;
          text-align: center; background: linear-gradient(180deg, #f0fdfa 0%, #fff 100%);
          border-bottom: 1px solid var(--border);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px; border-radius: 99px;
          background: var(--teal-l); border: 1px solid var(--teal-m);
          font-size: 12.5px; font-weight: 600; color: var(--teal-d);
          margin-bottom: 24px;
        }
        .hero-badge svg { color: #f59e0b; }
        .hero h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 800; color: var(--text1);
          letter-spacing: -1.5px; line-height: 1.1;
          margin-bottom: 20px;
        }
        .hero h1 em { color: var(--teal); font-style: italic; }
        .hero-sub { font-size: 17px; color: var(--text2); max-width: 520px; margin: 0 auto 36px; line-height: 1.6; font-weight: 400; }
        .hero-btns { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 56px; }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 11px; background: var(--teal); color: #fff;
          font-size: 15px; font-weight: 600; border: none; cursor: pointer;
          transition: all 0.15s; font-family: 'Outfit', sans-serif;
          box-shadow: 0 4px 16px rgba(13,148,136,0.3);
        }
        .hero-btn-primary:hover { background: var(--teal-d); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,148,136,0.35); }
        .hero-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 24px; border-radius: 11px;
          border: 1px solid var(--border); background: #fff;
          color: var(--text2); font-size: 15px; font-weight: 600;
          text-decoration: none; transition: all 0.15s;
        }
        .hero-btn-ghost:hover { border-color: var(--teal); color: var(--teal); background: var(--teal-l); }

        /* STATS */
        .stats-row { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; }
        .stat-item { padding: 0 32px; text-align: center; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; }
        .stat-val { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 800; color: var(--teal); letter-spacing: -0.5px; }
        .stat-lbl { font-size: 12px; color: var(--text3); font-weight: 500; margin-top: 2px; }

        /* SECTION COMMONS */
        section { padding: 80px 5%; }
        .section-badge {
          display: inline-block; padding: 4px 12px; border-radius: 99px;
          background: var(--teal-l); border: 1px solid var(--teal-m);
          font-size: 11.5px; font-weight: 600; color: var(--teal-d);
          margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.6px;
        }
        .section-title { font-family: 'Fraunces', serif; font-size: clamp(26px, 4vw, 38px); font-weight: 800; color: var(--text1); letter-spacing: -0.8px; margin-bottom: 10px; }
        .section-sub { font-size: 15px; color: var(--text2); max-width: 480px; line-height: 1.6; }
        .section-center { text-align: center; }
        .section-center .section-sub { margin: 0 auto; }

        /* FEATURES */
        .features-sec { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 48px; }
        .feat-card {
          background: #fff; border: 1px solid var(--border); border-radius: 14px;
          padding: 22px; transition: all 0.18s; box-shadow: var(--shadow);
        }
        .feat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--teal-m); }
        .feat-icon { width: 42px; height: 42px; background: var(--teal-l); border: 1px solid var(--teal-m); border-radius: 11px; display: flex; align-items: center; justify-content: center; color: var(--teal); margin-bottom: 14px; }
        .feat-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: var(--text1); margin-bottom: 6px; }
        .feat-desc { font-size: 13.5px; color: var(--text2); line-height: 1.6; }

        /* HOW IT WORKS */
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 48px; }
        .step-card {
          background: #fff; border: 1px solid var(--border); border-radius: 14px;
          padding: 22px; position: relative; box-shadow: var(--shadow);
        }
        .step-num {
          position: absolute; top: -12px; left: 20px;
          background: var(--teal); color: #fff;
          font-family: 'Fraunces', serif; font-size: 12px; font-weight: 800;
          padding: 2px 10px; border-radius: 99px;
          box-shadow: 0 2px 8px rgba(13,148,136,0.3);
        }
        .step-icon { width: 40px; height: 40px; background: var(--teal-l); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--teal); margin-bottom: 14px; margin-top: 6px; }
        .step-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: var(--text1); margin-bottom: 6px; }
        .step-desc { font-size: 13px; color: var(--text2); line-height: 1.5; }

        /* PLANS */
        .plans-sec { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }

        .plan-card {
          background: #fff; border: 2px solid var(--border); border-radius: 18px;
          overflow: hidden; box-shadow: var(--shadow);
          transition: all 0.18s; display: flex; flex-direction: column;
          position: relative;
        }
        .plan-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.1); transform: translateY(-3px); }
        .plan-card.popular { border-color: #8b5cf6; box-shadow: 0 4px 24px rgba(139,92,246,0.15); }

        .plan-popular-badge {
          position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
          background: #8b5cf6; color: #fff;
          font-size: 11px; font-weight: 700; padding: 4px 14px;
          border-radius: 0 0 10px 10px; letter-spacing: 0.4px; white-space: nowrap;
        }

        .plan-strip { height: 4px; }
        .plan-body { padding: 24px; flex: 1; }
        .plan-name { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .plan-price { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 800; color: var(--text1); letter-spacing: -1px; line-height: 1; }
        .plan-price-mo { font-size: 13px; font-weight: 400; color: var(--text3); font-family: 'Outfit', sans-serif; letter-spacing: 0; }
        .plan-desc { font-size: 13px; color: var(--text2); margin: 10px 0 18px; line-height: 1.5; }

        .plan-limits { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
        .plan-limit { padding: 10px; border-radius: 9px; background: #fafafa; border: 1px solid #f1f5f9; }
        .plan-limit-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text3); }
        .plan-limit-val { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 800; margin-top: 3px; }

        .plan-features-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .plan-feat-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text2); text-transform: capitalize; }
        .plan-feat-item svg { flex-shrink: 0; }

        .plan-footer { padding: 0 24px 22px; }
        .plan-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 12px; border-radius: 10px;
          font-size: 14px; font-weight: 600; border: none; cursor: pointer;
          transition: all 0.15s; font-family: 'Outfit', sans-serif;
        }
        .plan-btn:hover { transform: translateY(-1px); }

        /* FAQ */
        .faq-wrap { max-width: 680px; margin: 44px auto 0; display: flex; flex-direction: column; gap: 10px; }
        .faq-item { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .faq-q {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 16px 18px; background: transparent; border: none;
          font-size: 14.5px; font-weight: 600; color: var(--text1);
          cursor: pointer; text-align: left; font-family: 'Outfit', sans-serif;
          transition: background 0.14s;
        }
        .faq-q:hover { background: #fafafa; }
        .faq-q svg { flex-shrink: 0; color: var(--text3); transition: transform 0.2s; }
        .faq-q.open svg { transform: rotate(180deg); }
        .faq-a { padding: 0 18px 16px; font-size: 13.5px; color: var(--text2); line-height: 1.7; }

        /* CTA */
        .cta-sec {
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          text-align: center; padding: 80px 5%;
        }
        .cta-title { font-family: 'Fraunces', serif; font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: #fff; letter-spacing: -0.8px; margin-bottom: 12px; }
        .cta-sub { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 11px;
          background: #fff; color: var(--teal);
          font-size: 15px; font-weight: 700; border: none; cursor: pointer;
          transition: all 0.15s; font-family: 'Outfit', sans-serif;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        /* FOOTER */
        .footer {
          background: #0f172a; padding: 32px 5%;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .footer-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .footer-logo-mark { width: 30px; height: 30px; background: var(--teal); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 800; font-size: 14px; color: #fff; }
        .footer-brand { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: #fff; }
        .footer-copy { font-size: 12.5px; color: #475569; }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(15,23,42,0.5); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fade 0.15s ease;
        }
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: #fff; border-radius: 18px; width: 100%; max-width: 460px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          animation: slideup 0.2s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
        }
        @keyframes slideup { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-header {
          padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
        }
        .modal-header-l { }
        .modal-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--text1); }
        .modal-plan-chip {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 5px;
          padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid;
        }
        .modal-close { width: 28px; height: 28px; border: 1px solid var(--border); background: #fff; color: var(--text3); border-radius: 7px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; }
        .modal-close:hover { background: #fef2f2; border-color: #fca5a5; color: #ef4444; }

        .modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 13px; }

        .m-field { display: flex; flex-direction: column; gap: 5px; }
        .m-label { font-size: 12px; font-weight: 600; color: #374151; }
        .m-input {
          padding: 9px 12px; border: 1px solid var(--border); border-radius: 9px;
          font-size: 13.5px; font-family: 'Outfit', sans-serif; color: var(--text1);
          background: #fff; outline: none; transition: border 0.14s;
        }
        .m-input::placeholder { color: #d1d5db; }
        .m-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }

        .m-note { padding: 10px 13px; background: #f0fdfa; border: 1px solid var(--teal-m); border-radius: 9px; font-size: 12.5px; color: #0f766e; line-height: 1.6; }

        .m-submit {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 12px; border-radius: 10px;
          background: var(--teal); color: #fff; border: none;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.14s; font-family: 'Outfit', sans-serif;
          box-shadow: 0 3px 10px rgba(13,148,136,0.25);
        }
        .m-submit:hover:not(:disabled) { background: var(--teal-d); }
        .m-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        /* SUCCESS */
        .success-wrap { padding: 36px 28px; text-align: center; }
        .success-icon { width: 60px; height: 60px; background: #f0fdf4; border: 2px solid #a7f3d0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; color: #10b981; }
        .success-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 800; color: var(--text1); margin-bottom: 10px; }
        .success-sub { font-size: 14px; color: var(--text2); line-height: 1.7; margin-bottom: 18px; }
        .success-checklist { background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; font-size: 13px; color: var(--text2); line-height: 2; text-align: left; margin-bottom: 20px; }
        .success-btn {
          display: inline-block; padding: 11px 24px; border-radius: 10px;
          background: var(--teal); color: #fff; border: none; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.14s; font-family: 'Outfit', sans-serif;
          box-shadow: 0 3px 10px rgba(13,148,136,0.25);
        }
        .success-btn:hover { background: var(--teal-d); }

        .spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .plans-grid { grid-template-columns: repeat(1, 1fr); max-width: 440px; margin-left: auto; margin-right: auto; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .nav-links { display: none; }
          .nav-mob { display: flex; }
          .stat-item { padding: 12px 20px; }
          .stats-row { gap: 0; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">S</div>
          <span className="nav-brand">ShopSaaS</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#plans">Plans</a>
          <a href="#faq">FAQ</a>
          <button className="nav-cta" onClick={scrollToPlans}>
            Get Started
          </button>
        </div>
        <button className="nav-mob" onClick={() => setMobileNav(!mobileNav)}>
          <Menu size={18} />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <Star size={12} /> Pakistan's #1 Shop Management Software
        </div>
        <h1>
          Make Your Shop <em>Smart</em>
        </h1>
        <p className="hero-sub">
          Sales, inventory, employees — manage everything in one place. Perfect
          for small shops to large businesses.
        </p>
        <div className="hero-btns">
          <button className="hero-btn-primary" onClick={scrollToPlans}>
            Choose Plan <ArrowRight size={16} />
          </button>
          <a href="#features" className="hero-btn-ghost">
            View Features
          </a>
        </div>
        <div className="stats-row">
          {[
            ["500+", "Active Shops"],
            ["99.9%", "Uptime"],
            ["24hr", "Support"],
            ["3", "Flexible Plans"],
          ].map(([val, lbl]) => (
            <div className="stat-item" key={lbl}>
              <div className="stat-val">{val}</div>
              <div className="stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-sec">
        <div className="section-center">
          <div className="section-badge">Features</div>
          <div className="section-title">Everything You Need</div>
          <p className="section-sub">
            Every feature is designed to help your shop run smoothly.
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div className="feat-card" key={title}>
              <div className="feat-icon">
                <Icon size={20} />
              </div>
              <div className="feat-title">{title}</div>
              <div className="feat-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section>
        <div className="section-center">
          <div className="section-badge">Process</div>
          <div className="section-title">How It Works</div>
        </div>
        <div className="steps-grid">
          {STEPS.map(({ step, icon: Icon, title, desc }) => (
            <div className="step-card" key={step}>
              <div className="step-num">{step}</div>
              <div className="step-icon">
                <Icon size={18} />
              </div>
              <div className="step-title">{title}</div>
              <div className="step-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" ref={plansRef} className="plans-sec">
        <div className="section-center">
          <div className="section-badge">Pricing</div>
          <div className="section-title">Choose Your Plan</div>
          <p className="section-sub">
            From small shops to large businesses — there's a plan for everyone.
          </p>
        </div>

        {plansLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            Loading plans...
          </div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => {
              const m = PLAN_META[plan.name] || PLAN_META.normal;
              const isPopular = plan.name === "standard";
              return (
                <div
                  className={`plan-card ${isPopular ? "popular" : ""}`}
                  key={plan._id}
                >
                  {isPopular && (
                    <div className="plan-popular-badge">⭐ MOST POPULAR</div>
                  )}
                  <div
                    className="plan-strip"
                    style={{ background: m.accent }}
                  />
                  <div className="plan-body">
                    <div className="plan-name" style={{ color: m.accent }}>
                      {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <span className="plan-price">
                        {plan.price?.toLocaleString()}
                      </span>
                      <span className="plan-price-mo"> PKR/mo</span>
                    </div>
                    <p className="plan-desc">{plan.description}</p>
                    <div className="plan-limits">
                      <div className="plan-limit">
                        <div className="plan-limit-label">Employees</div>
                        <div
                          className="plan-limit-val"
                          style={{ color: m.accent }}
                        >
                          {plan.maxEmployees || "∞"}
                        </div>
                      </div>
                      <div className="plan-limit">
                        <div className="plan-limit-label">Products</div>
                        <div
                          className="plan-limit-val"
                          style={{ color: m.accent }}
                        >
                          {plan.maxProducts || "∞"}
                        </div>
                      </div>
                    </div>
                    <ul className="plan-features-list">
                      {(plan.features || []).map((f) => (
                        <li className="plan-feat-item" key={f}>
                          <CheckCircle size={13} style={{ color: m.accent }} />
                          {f.replace(/_/g, " ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="plan-footer">
                    <button
                      className="plan-btn"
                      style={{
                        background: m.bg,
                        color: m.text,
                        border: `1.5px solid ${m.border}`,
                      }}
                      onClick={() => openRegister(plan)}
                    >
                      Register with This Plan <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="section-center">
          <div className="section-badge">FAQ</div>
          <div className="section-title">Frequently Asked Questions</div>
        </div>
        <div className="faq-wrap">
          {FAQS.map((faq, i) => (
            <div className="faq-item" key={i}>
              <button
                className={`faq-q ${openFaq === i ? "open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown size={16} />
              </button>
              {openFaq === i && <div className="faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="cta-title">Ready? Get Started Now!</div>
        <div className="cta-sub">
          Thousands of shop owners are already using ShopSaaS.
        </div>
        <button className="cta-btn" onClick={scrollToPlans}>
          Choose Plan <ArrowRight size={16} />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#" className="footer-logo">
          <div className="footer-logo-mark">S</div>
          <span className="footer-brand">ShopSaaS</span>
        </a>
        <span className="footer-copy">
          © 2025 ShopSaaS — All Rights Reserved
        </span>
      </footer>

      {/* REGISTRATION MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="success-wrap">
                <div className="success-icon">
                  <CheckCircle size={28} />
                </div>
                <div className="success-title">Registration Successful!</div>
                <p className="success-sub">
                  Thank you! We have received your request.
                  <br />
                  You will receive an email with login details within{" "}
                  <strong>24 hours</strong>.
                </p>
                <div className="success-checklist">
                  ✅ Keep checking your email inbox
                  <br />
                  ✅ Also check your spam/junk folder
                  <br />✅ Log in after receiving approval
                </div>
                <button
                  className="success-btn"
                  onClick={() => setShowForm(false)}
                >
                  Okay, Thank You!
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-header-l">
                    <div className="modal-title">Register Now</div>
                    {selectedPlan && (
                      <div
                        className="modal-plan-chip"
                        style={{
                          background: meta.bg,
                          color: meta.text,
                          borderColor: meta.border,
                        }}
                      >
                        {selectedPlan.name} Plan — PKR{" "}
                        {selectedPlan.price?.toLocaleString()}/mo
                      </div>
                    )}
                  </div>
                  <button
                    className="modal-close"
                    onClick={() => setShowForm(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {[
                      {
                        key: "shopName",
                        label: "Shop Name *",
                        placeholder: "Ahmed General Store",
                        type: "text",
                      },
                      {
                        key: "ownerName",
                        label: "Owner Name *",
                        placeholder: "Ahmed Khan",
                        type: "text",
                      },
                      {
                        key: "email",
                        label: "Email Address *",
                        placeholder: "ahmed@example.com",
                        type: "email",
                      },
                      {
                        key: "phone",
                        label: "Phone Number *",
                        placeholder: "03001234567",
                        type: "tel",
                      },
                    ].map(({ key, label, placeholder, type }) => (
                      <div className="m-field" key={key}>
                        <label className="m-label">{label}</label>
                        <input
                          className="m-input"
                          type={type}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) => set(key, e.target.value)}
                        />
                      </div>
                    ))}
                    <div className="m-note">
                      📧 You will receive a confirmation email after submitting
                      the form.
                      <br />✅ Approval + login details will arrive within 24
                      hours.
                    </div>
                    <button
                      type="submit"
                      className="m-submit"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="spin" /> Submitting...
                        </>
                      ) : (
                        "Submit Registration →"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
