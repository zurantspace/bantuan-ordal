import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';
import { sendAffiliateApprovalEmail } from '@/lib/server/brevo';
import { sendWA } from '@/lib/server/fonnte';

const ApproveSchema = z.object({
  action: z.enum(['approve', 'suspend']),
});

// PUT /api/admin/affiliate/[id]/approve
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { id } = await params;
  const body = await req.json();
  const parsed = ApproveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  }

  const newStatus = parsed.data.action === 'approve' ? 'APPROVED' : 'SUSPENDED';

  const affiliate = await prisma.affiliate.update({
    where: { id },
    data: { status: newStatus },
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  });

  // Send approval notification
  if (newStatus === 'APPROVED') {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bantuan-ordal.id';
    const affiliateLink = `${APP_URL}/?ref=${affiliate.referralCode}`;
    const data = {
      name: affiliate.user.name,
      affiliateLink,
      referralCode: affiliate.referralCode,
    };
    await Promise.all([
      sendAffiliateApprovalEmail(affiliate.user.email, affiliate.user.name, affiliate.referralCode),
      sendWA('W06', affiliate.user.phone, data, affiliate.user.id),
    ]).catch(console.error);
  }

  return NextResponse.json({ success: true, affiliate: { id: affiliate.id, status: affiliate.status } });
}
