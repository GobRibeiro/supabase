import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/projects/:id/checklists
export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("checklists")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/projects/:id/checklists
export async function POST(request, { params }) {
  const { id } = await params;
  const { title } = await request.json();
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("checklists")
    .insert({ project_id: id, title })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
