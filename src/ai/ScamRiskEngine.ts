import type { RiskResult, RiskLevel } from '@/types';

export interface ScamRiskInput {
  merchantVerified: boolean;
  discountPercent: number;
  paymentIdMatchesMerchant: boolean;
  linkLooksOfficial: boolean;
  offerTitle: string;
  link: string;
}

const SUSPICIOUS_WORDS = [
  'free uc',
  'instant diamonds',
  '100% cashback',
  'unlimited coins',
  'free topup',
  'giveaway prize',
  'free skins',
  'hack',
  'generator',
  'unlimited uc',
];

export function assessRisk(input: ScamRiskInput): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  if (!input.merchantVerified) {
    score += 35;
    reasons.push('Merchant is not verified.');
  }

  if (input.discountPercent >= 50) {
    score += 25;
    reasons.push(`Discount is unusually high (${input.discountPercent}%).`);
  }

  if (!input.paymentIdMatchesMerchant) {
    score += 20;
    reasons.push('Payment ID does not match the merchant.');
  }

  if (!input.linkLooksOfficial) {
    score += 20;
    reasons.push('The link does not look official.');
  }

  const combinedText = `${input.offerTitle} ${input.link}`.toLowerCase();
  const foundWords = SUSPICIOUS_WORDS.filter((w) => combinedText.includes(w));
  if (foundWords.length > 0) {
    score += 10 * foundWords.length;
    reasons.push(`Suspicious keywords detected: ${foundWords.join(', ')}.`);
  }

  score = Math.min(score, 100);

  let riskLevel: RiskLevel;
  if (score >= 60) riskLevel = 'HIGH RISK';
  else if (score >= 30) riskLevel = 'REVIEW';
  else riskLevel = 'LOW RISK';

  const explanation = buildExplanation(input, score, riskLevel, reasons);
  const recommendedAction = buildAction(riskLevel);

  return { score, riskLevel, reasons, explanation, recommendedAction };
}

function buildExplanation(
  input: ScamRiskInput,
  score: number,
  level: RiskLevel,
  reasons: string[]
): string {
  const levelText =
    level === 'HIGH RISK'
      ? 'High Risk'
      : level === 'REVIEW'
        ? 'Caution'
        : 'Low Risk';

  const detail =
    reasons.length > 0
      ? reasons.join(' ').replace(/\.$/, '')
      : 'No significant risk indicators detected.';

  if (level === 'LOW RISK') {
    return `Low Risk: The offer appears legitimate. The merchant is verified and the payment details are consistent. Always stay alert when making payments online.`;
  }

  return `${levelText}: ${detail}. Risk score: ${score}/100.`;
}

function buildAction(level: RiskLevel): string {
  switch (level) {
    case 'HIGH RISK':
      return 'Do not proceed with this payment. Use an official game store or a verified seller instead.';
    case 'REVIEW':
      return 'Take time to verify the merchant and payment details before proceeding. Do not rush into the payment.';
    case 'LOW RISK':
      return 'This offer appears safe, but always double-check before making any payment.';
  }
}
