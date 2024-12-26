import { Router } from 'express';
import auth from '../../middlewares/auth';
import { WalletController } from './wallet.controllers';

const router = Router();

router.get('/:userId', auth('user'), WalletController.getWallet);
router.post('/withdraw-money', auth('user'), WalletController.withdrawMoney);

export const WalletRoutes = router;
