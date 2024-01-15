import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { nextAuthOptions } from "../auth/[...nextauth]/route"
import prisma from "@/prisma/PrismaClient"
import { Status } from "@prisma/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const host = process.env.NEXT_PUBLIC_HOST

export const POST = async () => {
  const userSession = await getServerSession(nextAuthOptions())
  if (!userSession?.user.id) {
    return NextResponse.json({ error: "Missing session user id" })
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    metadata: {
      userId: userSession.user.id,
    },
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: "Travel Where Premium",
            description: "Simulate a payment by entering FAKE details below.",
          },
          unit_amount: 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    cancel_url: `${host}/results`,
    success_url: `${host}/results?payment="pending"`,
  })
  return NextResponse.json({ sessionId: session.id })
}

export const DELETE = async () => {
  const userSession = await getServerSession(nextAuthOptions())
  if (!userSession?.user.id) {
    return NextResponse.json({ error: "Missing session user id" })
  }
  await prisma.user.update({
    where: {
      id: userSession.user.id,
    },
    data: {
      status: Status.UNPAID,
    },
  })
  return NextResponse.json({ success: "Cancelled Membership" })
}
