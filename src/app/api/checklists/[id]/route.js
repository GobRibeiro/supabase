import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PATCH /api/checklists/:id
export async function PATCH(request, { params }) {
  const { id } = await params;

  // Fetch current state
  const { data: current, error: fetchError } = await supabase
    .from("checklists")
    .select("done")
    .eq("id", id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  // Toggle
  const { data, error } = await supabase
    .from("checklists")
    .update({ done: !current.done })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/checklists/:id
export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("checklists").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
