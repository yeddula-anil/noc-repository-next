import Noc from '../../../../models/Noc'
import dbConnect from '../../../lib/dbConnect';
import { NextResponse } from 'next/server';
export async function GET(req) {
  try {
    await dbConnect();

    // optional filter: year from query param
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const stage=searchParams.get("stage");
    const branch=searchParams.get("branch");

    const filter = { "approvals.stage": stage,"branch":branch };
    if (year) filter.year = year;

    const applications = await Noc.find(filter).sort({ createdAt: 1 });

    return NextResponse.json(applications, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
