// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { consultations, users, consultationNotes } from '@/lib/schema';
// import { getAuthUser } from '@/lib/auth';
// import { desc, eq, and, or } from 'drizzle-orm';

// export async function GET(request: NextRequest) {
//   try {
//     // Verify authentication
//     const user = await getAuthUser();
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Authentication required' },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get('status');
//     const assignedTo = searchParams.get('assigned_to');
//     const limit = parseInt(searchParams.get('limit') || '50');
//     const offset = parseInt(searchParams.get('offset') || '0');

//     const whereConditions: any[] = [];

//     // Apply filters based on user role
//     if (user.role === 'admin') {
//       // Admin can see all consultations
//       if (status) {
//         whereConditions.push(eq(consultations.status, status as any));
//       }
//       if (assignedTo) {
//         whereConditions.push(eq(consultations.assigned_to, parseInt(assignedTo)));
//       }
//     } else {
//       // Employees can only see consultations assigned to them
//       whereConditions.push(eq(consultations.assigned_to, user.id));
//       if (status) {
//         whereConditions.push(eq(consultations.status, status as any));
//       }
//     }

//     let results;
//     if (whereConditions.length > 0) {
//       results = await db
//         .select({
//           consultation: consultations,
//           assignedAdvisor: {
//             id: users.id,
//             first_name: users.first_name,
//             last_name: users.last_name,
//             email: users.email,
//             role: users.role,
//             specialization: users.specialization,
//           }
//         })
//         .from(consultations)
//         .leftJoin(users, eq(consultations.assigned_to, users.id))
//         .where(and(...whereConditions))
//         .orderBy(desc(consultations.created_at))
//         .limit(limit)
//         .offset(offset);
//     } else {
//       results = await db
//         .select({
//           consultation: consultations,
//           assignedAdvisor: {
//             id: users.id,
//             first_name: users.first_name,
//             last_name: users.last_name,
//             email: users.email,
//             role: users.role,
//             specialization: users.specialization,
//           }
//         })
//         .from(consultations)
//         .leftJoin(users, eq(consultations.assigned_to, users.id))
//         .orderBy(desc(consultations.created_at))
//         .limit(limit)
//         .offset(offset);
//     }
    
//     return NextResponse.json({
//       success: true,
//       count: results.length,
//       consultations: results.map(result => ({
//         ...result.consultation,
//         assigned_advisor: result.assignedAdvisor
//       }))
//     });
//   } catch (error) {
//     console.error('Error fetching consultations:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Unknown error' 
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getAuthUser();
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Authentication required' },
//         { status: 401 }
//       );
//     }

//     const { consultationId, ...updateData } = await request.json();

//     if (!consultationId) {
//       return NextResponse.json(
//         { error: 'Consultation ID is required' },
//         { status: 400 }
//       );
//     }

//     // Check if consultation exists and user has permission to update it
//     const consultation = await db
//       .select()
//       .from(consultations)
//       .where(eq(consultations.id, consultationId))
//       .limit(1);

//     if (consultation.length === 0) {
//       return NextResponse.json(
//         { error: 'Consultation not found' },
//         { status: 404 }
//       );
//     }

//     const consultationData = consultation[0];

//     // Permission check: admin can update any, employees can only update their assigned consultations
//     if (user.role !== 'admin' && consultationData.assigned_to !== user.id) {
//       return NextResponse.json(
//         { error: 'Insufficient permissions' },
//         { status: 403 }
//       );
//     }

//     // Prepare update data
//     const allowedFields = [
//       'status', 'priority', 'scheduled_date', 'completed_date',
//       'estimated_duration', 'actual_duration', 'consultation_fee',
//       'client_satisfaction_rating', 'advisor_notes', 'follow_up_required',
//       'follow_up_date', 'assigned_to'
//     ];

//     const updates: any = { updated_at: new Date() };
    
//     for (const field of allowedFields) {
//       if (updateData[field] !== undefined) {
//         updates[field] = updateData[field];
//       }
//     }

//     // Only admin can assign consultations
//     if (updateData.assigned_to && user.role !== 'admin') {
//       delete updates.assigned_to;
//     }

//     const updatedConsultation = await db
//       .update(consultations)
//       .set(updates)
//       .where(eq(consultations.id, consultationId))
//       .returning();

//     return NextResponse.json({
//       success: true,
//       message: 'Consultation updated successfully',
//       consultation: updatedConsultation[0]
//     });

//   } catch (error) {
//     console.error('Error updating consultation:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
