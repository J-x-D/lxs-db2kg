import { type CustomLxsStore } from "store/store";
import { NextRequest } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_API_KEY ?? "re_VmCmEYjX_F7yq13StYF2ALz2ur5KwvxwG");

export async function POST(request: NextRequest) {

  const {
    email,
    fullName,
    store,
  }: {
    email: string;
    fullName: string;
    store: CustomLxsStore;
  } = await request.json();

  const htmlText = `
    <h1>New test completed from ${fullName}:</h1>
    <p>See the attached file for the triples they created.</p>
    <p>Their email is <a href="mailto:${email}">${email}</a></p>
  `;
  try {
    const { data, error } = await resend.emails.send({
      from: 'Study <study@neuro-symbolic.studio>',
      to: [process.env.NEXT_PUBLIC_MY_EMAIL ?? 'jandavid.stuetz@gmail.com'],
      subject: `${fullName} completed the study!`,
      html: htmlText,
      attachments: [
        {
          filename: 'triples.json',
          content: JSON.stringify(store),
        },
      ],
    });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}