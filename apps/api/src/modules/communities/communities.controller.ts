import { Controller, Get } from '@nestjs/common'

const COMMUNITIES = [
  { id: '1', name: 'Kitesurf Brasil', modality: 'KITESURF', region: 'Nacional', url: 'https://chat.whatsapp.com/placeholder' },
  { id: '2', name: 'Wingfoil Brasil', modality: 'WINGFOIL', region: 'Nacional', url: 'https://chat.whatsapp.com/placeholder' },
  { id: '3', name: 'Kite Norte & Nordeste', modality: 'KITESURF', region: 'Norte/Nordeste', url: 'https://chat.whatsapp.com/placeholder' },
]

@Controller('communities')
export class CommunitiesController {
  @Get()
  getAll() {
    return COMMUNITIES
  }
}
