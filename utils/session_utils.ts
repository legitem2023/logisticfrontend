import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Client-side function to delete session
export async function deleteClientSession() {
  try {
    await signOut({ redirect: false });
    // Clear any client-side storage if needed
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sessionData');
      sessionStorage.removeItem('sessionData');
    }
    return { success: true, message: "Session deleted successfully" };
  } catch (error) {
    console.error("Error deleting client session:", error);
    return { success: false, message: "Failed to delete session" };
  }
}

// Server-side function to handle session invalidation
export async function deleteServerSession(request: Request) {
  try {
    const session = await getServerSession(authOptions);    
    if (session?.serverToken) {
      // Call your backend API to invalidate the server token
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_LINK}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.serverToken}`,
          'Content-Type': 'application/json',
        },
      });      
      if (!response.ok) {
        throw new Error('Failed to invalidate server token');
      }
    }
    
    // Clear any server-side cookies using next/headers
    const cookieStore = cookies();
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('next-auth.csrf-token');
    
    return NextResponse.json({ 
      success: true, 
      message: "Session deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting server session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete session" },
      { status: 500 }
    );
  }
}

// API route handler example (create app/api/auth/delete/route.ts)
export async function POST(request: Request) {
  return deleteServerSession(request);
}

// Alternative: Comprehensive session cleanup function
export async function comprehensiveSessionCleanup() {
  try {
    // Client-side cleanup
    if (typeof window !== 'undefined') {
      await signOut({ redirect: false });
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies (client-side)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      return { success: true, message: "Session completely cleaned up" };
    }
    
    // Server-side cleanup
    const cookieStore = cookies();
    const session = await getServerSession(authOptions);
    
    if (session?.serverToken) {
      // Invalidate server token
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_LINK}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.serverToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to invalidate server token');
      }
    }
    
    // Clear auth cookies
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('next-auth.csrf-token');
    
    return { success: true, message: "Session completely cleaned up" };
  } catch (error) {
    console.error("Comprehensive session cleanup error:", error);
    return { success: false, message: "Failed to clean up session" };
  }
}
