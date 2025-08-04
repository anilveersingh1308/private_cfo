import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Fixing dashboard user status...');
    
    // Update dashboard user to ensure it's active
    const updatedUser = await db
      .update(users)
      .set({ 
        status: 'active',
        updated_at: new Date()
      })
      .where(eq(users.email, 'dashboard@cfo.com'))
      .returning();
    
    if (updatedUser.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'dashboard user not found'
      }, { status: 404 });
    }
    
    console.log('✅ dashboard user status updated to active');
    
    return NextResponse.json({
      success: true,
      message: 'dashboard user status fixed',
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        status: updatedUser[0].status,
        role: updatedUser[0].role,
        name: updatedUser[0].name
      }
    });
    
  } catch (error) {
    console.error('❌ Error fixing dashboard user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fix dashboard user',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
