import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
    
    return NextResponse.json({
      riskWeight: 0.2,
      scamInteractions: [],
      suspiciousContracts: []
    });
  } catch (error) {
    console.error('Scam analysis error:', error);
    return NextResponse.json({ riskWeight: 0.5 });
  }
} 