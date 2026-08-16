import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Check, 
  Award, 
  Sparkles, 
  ChevronRight, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Dna, 
  ShieldCheck,
  Zap,
  Info,
  Loader2
} from "lucide-react";

interface PremiumPricingProps {
  onActivatePremium: () => void;
  onClose: () => void;
}

export default function PremiumPricing({ onActivatePremium, onClose }: PremiumPricingProps) {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  
  // Simulated Card input states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const price = billingCycle === "monthly" ? 14.99 : 8.25; // 99/year
  const savingsText = billingCycle === "yearly" ? t("premium.billedYearly", { amount: 99 }) : t("premium.billedMonthly");

  // Try Stripe Checkout first; fall back to the simulated card form when Stripe isn't configured
  const handleChoosePlan = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billingCycle }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      // Stripe not configured (501) or error → use built-in simulated checkout
      setIsSubmitting(false);
      setShowCheckout(true);
    } catch {
      setIsSubmitting(false);
      setShowCheckout(true);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate premium payment
    setTimeout(() => {
      setIsSubmitting(false);
      setPaymentDone(true);
      onActivatePremium();
    }, 2000);
  };

  const premiumFeatures = [
    { title: t("premium.features.analysis"), desc: t("premium.features.analysisDesc") },
    { title: t("premium.features.healing"), desc: t("premium.features.healingDesc") },
    { title: t("premium.features.meals"), desc: t("premium.features.mealsDesc") },
    { title: t("premium.features.ai"), desc: t("premium.features.aiDesc") },
    { title: t("premium.features.partners"), desc: t("premium.features.partnersDesc") },
    { title: t("premium.features.ads"), desc: t("premium.features.adsDesc") }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex overflow-y-auto p-4">
      
      {!showCheckout ? (
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full max-w-4xl m-auto overflow-hidden border border-slate-100 animate-scale-up">
          {/* Header section with gradient */}
          <div className="bg-[#0fb3a9] p-8 text-white relative text-center">
            <button 
              id="btn-close-pricing"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs transition cursor-pointer"
            >
              {t("premium.backToApp")}
            </button>
            
            <div className="mx-auto w-12 h-12 bg-white/10 border border-white/20 text-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Award className="w-7 h-7 text-teal-300" />
            </div>

            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl">{t("premium.title")}</h3>
            <p className="text-teal-200/90 text-sm mt-2 max-w-md mx-auto">
              {t("premium.desc")}
            </p>

            {/* Toggle monthly vs yearly */}
            <div className="flex items-center justify-center mt-6">
              <div className="bg-black/20 p-1 rounded-xl border border-white/10 flex items-center">
                <button
                  id="btn-billing-monthly"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === "monthly" ? "bg-[#14cec3] text-white shadow-sm" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t("premium.monthly")}
                </button>
                <button
                  id="btn-billing-yearly"
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all relative flex items-center space-x-1 cursor-pointer ${
                    billingCycle === "yearly" ? "bg-[#14cec3] text-white shadow-sm" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{t("premium.yearly")}</span>
                  <span className="bg-amber-400 text-slate-950 text-[8px] font-extrabold px-1 rounded uppercase">
                    {t("premium.discount")}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing grid and features */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Left side: Premium value list */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{t("premium.included")}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {premiumFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="p-1 rounded-full bg-teal-100 text-teal-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{feat.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Subscription Call-to-action */}
            <div className="md:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between text-center">
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-2">{t("premium.subscription")}</span>
                
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold font-sans text-[#0fb3a9]">{price}</span>
                  <span className="text-lg font-bold text-slate-400 ml-1">{t("premium.perMonth")}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium leading-relaxed">
                  {savingsText}
                </p>

                <div className="mt-4 p-3 bg-white border border-slate-200/50 rounded-xl text-left flex items-start space-x-2 text-[10px] text-slate-500">
                  <Info className="w-4 h-4 text-[#0fb3a9] shrink-0 font-bold" />
                  <span>{t("premium.supportText")}</span>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <button
                  id="btn-goto-checkout"
                  onClick={handleChoosePlan}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("premium.redirecting")}</span>
                    </>
                  ) : (
                    <span>{t("premium.choosePlan")}</span>
                  )}
                </button>
                <button
                  id="btn-cancel-pricing-box"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 block mx-auto transition cursor-pointer"
                >
                  {t("premium.continueFree")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* checkout details simulation */
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full max-w-md m-auto overflow-hidden border border-slate-100 animate-scale-up">
          
          {paymentDone ? (
            /* Celebration portal on complete payment */
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-teal-50 text-[#0fb3a9] rounded-full flex items-center justify-center animate-bounce">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xl text-slate-800">{t("premium.congrats", { name: "Camille" })}</h4>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{t("premium.congratsDesc")}</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-[11px] font-semibold text-[#0fb3a9] flex items-center justify-center space-x-2">
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                <span>{t("premium.unlocked")}</span>
              </div>
              <button
                id="btn-celebrate-done"
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
              >
                {t("premium.accessPremium")}
              </button>
            </div>
          ) : (
            /* Payment Card entry */
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-sans font-bold text-lg text-slate-800">{t("premium.checkoutTitle")}</h4>
                  <p className="text-slate-400 text-xs">{t("premium.checkoutSubtitle")}</p>
                </div>
                <button 
                  type="button"
                  id="btn-back-to-pricing"
                  onClick={() => setShowCheckout(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Price Tag in checkout */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-600">{t("premium.total")}</span>
                <span className="font-mono text-base font-bold text-slate-800">{price} {t("premium.perMonth")}</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("premium.cardName")}</label>
                <input
                  type="text"
                  required
                  placeholder="Camille N."
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("premium.cardNumber")}</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("premium.cardExpiry")}</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("premium.cardCvv")}</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0fb3a9] font-mono"
                  />
                </div>
              </div>

              {/* Secure footer */}
              <div className="flex items-center space-x-1.5 text-[9px] text-slate-400 justify-center py-2 border-t border-slate-100">
                <Lock className="w-3.5 h-3.5 text-[#0fb3a9]" />
                <span>{t("premium.secureFooter")}</span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  id="btn-cancel-checkout"
                  onClick={() => setShowCheckout(false)}
                  className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  {t("common.back")}
                </button>
                <button
                  type="submit"
                  id="btn-confirm-payment"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-gradient-to-r from-[#14cec3] to-[#0fb3a9] hover:from-[#0fb3a9] hover:to-[#0d9488] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{t("premium.validating")}</span>
                    </>
                  ) : (
                    <span>{t("premium.pay")}</span>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      )}

    </div>
  );
}
