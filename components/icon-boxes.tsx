import { Car, ShieldCheck, Headset, WalletCards } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className='grid md:grid-cols-4 gap-4 p-4'>
          <div className='space-y-2'>
            <Car />
            <div className='text-sm font-bold'>Livraison gratuite de votre voiture</div>
            <div className='text-sm text-muted-foreground'>
              Nous livrons votre voiture sans frais supplémentaires
            </div>
          </div>
          <div className='space-y-2'>
            <ShieldCheck />
            <div className='text-sm font-bold'>Paiement sécurisé</div>
            <div className='text-sm text-muted-foreground'>
              Vos transactions sont protégées et cryptées
            </div>
          </div>
          <div className='space-y-2'>
            <WalletCards />
            <div className='text-sm font-bold'>Paiement flexible</div>
            <div className='text-sm text-muted-foreground'>
              Payer par carte de crédit, PayPal ou contre remboursement
            </div>
          </div>
          <div className='space-y-2'>
            <Headset />
            <div className='text-sm font-bold'>Support 24/7</div>
            <div className='text-sm text-muted-foreground'>
              Assistance disponible à tout moment
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
