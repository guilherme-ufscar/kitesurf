import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminService } from './admin.service'

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private admin: AdminService) {}

  // Stats
  @Get('stats')
  getStats() {
    return this.admin.getStats()
  }

  // Users
  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('verified') verified?: string,
  ) {
    return this.admin.getUsers({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      verified: verified ? verified === 'true' : undefined,
    })
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.admin.getUserById(id)
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: { isVerified?: boolean; verificationLevel?: string; subscriptionPlan?: string }) {
    return this.admin.updateUser(id, body)
  }

  // Listings
  @Get('listings')
  getListings(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
  ) {
    return this.admin.getListings({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      status,
      userId,
    })
  }

  @Patch('listings/:id')
  updateListing(@Param('id') id: string, @Body() body: { status?: string; isFeatured?: boolean; featuredUntil?: string }) {
    return this.admin.updateListing(id, {
      ...body,
      featuredUntil: body.featuredUntil ? new Date(body.featuredUntil) : undefined,
    })
  }

  @Delete('listings/:id')
  deleteListing(@Param('id') id: string) {
    return this.admin.deleteListing(id)
  }

  // Payments
  @Get('payments')
  getPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.admin.getPayments({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
      type,
    })
  }

  @Patch('payments/:id')
  updatePaymentStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.admin.updatePaymentStatus(id, body.status)
  }

  // Verification requests
  @Get('verifications')
  getVerifications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.admin.getVerificationRequests({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
    })
  }

  @Patch('verifications/:id/approve')
  approveVerification(@Param('id') id: string) {
    return this.admin.approveVerificationRequest(id)
  }

  @Patch('verifications/:id/reject')
  rejectVerification(@Param('id') id: string, @Body() body: { notes?: string }) {
    return this.admin.rejectVerificationRequest(id, body.notes)
  }
}