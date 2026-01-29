import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsCronService } from './notifications.cron';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../database/prisma.service';

describe('NotificationsCronService', () => {
  let service: NotificationsCronService;
  let notificationsService: NotificationsService;
  let prismaService: PrismaService;

  const mockNotificationsService = {
    sendToUser: jest.fn(),
    sendToAll: jest.fn(),
    sendToRole: jest.fn(),
  };

  const mockPrismaService = {
    intervention: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsCronService,
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationsCronService>(NotificationsCronService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMorningReminder', () => {
    it('should not send notifications when no interventions today', async () => {
      mockPrismaService.intervention.findMany.mockResolvedValue([]);

      await service.sendMorningReminder();

      expect(mockNotificationsService.sendToUser).not.toHaveBeenCalled();
      expect(mockNotificationsService.sendToAll).not.toHaveBeenCalled();
    });

    it('should send notification to assigned employee', async () => {
      const mockInterventions = [
        {
          id: '1',
          employeId: 'emp-1',
          heureDebut: new Date('2026-01-29T09:00:00'),
          chantier: {
            ville: 'Angers',
            client: { nom: 'Dupont', prenom: 'Jean' },
          },
          employe: { id: 'emp-1', nom: 'Martin', prenom: 'Pierre' },
        },
      ];

      mockPrismaService.intervention.findMany.mockResolvedValue(mockInterventions);
      mockNotificationsService.sendToUser.mockResolvedValue({ success: true });

      await service.sendMorningReminder();

      expect(mockNotificationsService.sendToUser).toHaveBeenCalledWith(
        'emp-1',
        expect.objectContaining({
          title: 'Interventions du jour',
          url: '/interventions',
          tag: 'daily-reminder',
        }),
      );
    });

    it('should send notification to all when intervention not assigned', async () => {
      const mockInterventions = [
        {
          id: '1',
          employeId: null,
          heureDebut: new Date('2026-01-29T09:00:00'),
          chantier: {
            ville: 'Angers',
            client: { nom: 'Dupont', prenom: 'Jean' },
          },
          employe: null,
        },
      ];

      mockPrismaService.intervention.findMany.mockResolvedValue(mockInterventions);
      mockNotificationsService.sendToAll.mockResolvedValue({ success: true });

      await service.sendMorningReminder();

      expect(mockNotificationsService.sendToAll).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/interventions',
          tag: 'daily-reminder',
        }),
      );
    });

    it('should group interventions by employee', async () => {
      const mockInterventions = [
        {
          id: '1',
          employeId: 'emp-1',
          heureDebut: new Date('2026-01-29T09:00:00'),
          chantier: { ville: 'Angers', client: { nom: 'Dupont' } },
          employe: { id: 'emp-1', nom: 'Martin' },
        },
        {
          id: '2',
          employeId: 'emp-1',
          heureDebut: new Date('2026-01-29T14:00:00'),
          chantier: { ville: 'Nantes', client: { nom: 'Martin' } },
          employe: { id: 'emp-1', nom: 'Martin' },
        },
      ];

      mockPrismaService.intervention.findMany.mockResolvedValue(mockInterventions);
      mockNotificationsService.sendToUser.mockResolvedValue({ success: true });

      await service.sendMorningReminder();

      // Should only send one notification for the employee with both interventions
      expect(mockNotificationsService.sendToUser).toHaveBeenCalledTimes(1);
      expect(mockNotificationsService.sendToUser).toHaveBeenCalledWith(
        'emp-1',
        expect.objectContaining({
          body: expect.stringContaining('2 interventions'),
        }),
      );
    });
  });

  describe('sendEveningReminder', () => {
    it('should not send notifications when no interventions tomorrow', async () => {
      mockPrismaService.intervention.findMany.mockResolvedValue([]);

      await service.sendEveningReminder();

      expect(mockNotificationsService.sendToUser).not.toHaveBeenCalled();
      expect(mockNotificationsService.sendToRole).not.toHaveBeenCalled();
    });

    it('should send notification to assigned employee for tomorrow', async () => {
      const mockInterventions = [
        {
          id: '1',
          employeId: 'emp-1',
          heureDebut: new Date('2026-01-30T10:00:00'),
          chantier: {
            ville: 'Angers',
            client: { nom: 'Dupont', prenom: 'Jean' },
          },
          employe: { id: 'emp-1', nom: 'Martin', prenom: 'Pierre' },
        },
      ];

      mockPrismaService.intervention.findMany.mockResolvedValue(mockInterventions);
      mockNotificationsService.sendToUser.mockResolvedValue({ success: true });

      await service.sendEveningReminder();

      expect(mockNotificationsService.sendToUser).toHaveBeenCalledWith(
        'emp-1',
        expect.objectContaining({
          title: 'Rappel: interventions demain',
          url: '/interventions',
          tag: 'tomorrow-reminder',
        }),
      );
    });

    it('should notify patron for unassigned interventions tomorrow', async () => {
      const mockInterventions = [
        {
          id: '1',
          employeId: null,
          heureDebut: new Date('2026-01-30T10:00:00'),
          chantier: {
            ville: 'Angers',
            client: { nom: 'Dupont', prenom: 'Jean' },
          },
          employe: null,
        },
      ];

      mockPrismaService.intervention.findMany.mockResolvedValue(mockInterventions);
      mockNotificationsService.sendToRole.mockResolvedValue({ success: true });

      await service.sendEveningReminder();

      expect(mockNotificationsService.sendToRole).toHaveBeenCalledWith(
        'patron',
        expect.objectContaining({
          tag: 'tomorrow-reminder',
        }),
      );
    });
  });

  describe('manual triggers', () => {
    it('triggerMorningReminder should call sendMorningReminder', async () => {
      mockPrismaService.intervention.findMany.mockResolvedValue([]);

      const spy = jest.spyOn(service, 'sendMorningReminder');
      await service.triggerMorningReminder();

      expect(spy).toHaveBeenCalled();
    });

    it('triggerEveningReminder should call sendEveningReminder', async () => {
      mockPrismaService.intervention.findMany.mockResolvedValue([]);

      const spy = jest.spyOn(service, 'sendEveningReminder');
      await service.triggerEveningReminder();

      expect(spy).toHaveBeenCalled();
    });
  });
});
