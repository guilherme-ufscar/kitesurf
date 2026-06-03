import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ChatService } from './chat.service'

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chat: ChatService) {}

  @Post('conversations')
  startConversation(@Request() req: any, @Body() body: { listingId: string }) {
    return this.chat.getOrCreateConversation(body.listingId, req.user.id)
  }

  @Get('conversations')
  getConversations(@Request() req: any) {
    return this.chat.getUserConversations(req.user.id)
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Param('id') id: string,
    @Request() req: any,
    @Query('cursor') cursor?: string,
  ) {
    return this.chat.getMessages(id, req.user.id, cursor)
  }
}
