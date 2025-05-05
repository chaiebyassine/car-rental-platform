'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function PaymentMethodScreen() {
  const [paymentMethod, setPaymentMethod] = useState('')
  const router = useRouter()

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentMethod) return alert('Veuillez choisir un mode de paiement')
    // Ici tu pourrais sauvegarder le mode dans le context / cookie
    router.push('/place-order')
  }

  return (
    <form onSubmit={submitHandler} className="max-w-xl mx-auto my-10 space-y-6">
      <h2 className="text-2xl font-bold">Mode de paiement</h2>
      <p>Veuillez sélectionner un mode de paiement</p>

      <div className="space-y-4">
        <label className="block">
          <input
            type="radio"
            name="paymentMethod"
            value="virement"
            checked={paymentMethod === 'virement'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          Virement bancaire
          {paymentMethod === 'virement' && (
            <p className="mt-2 text-sm text-red-600">
              Attention : si nous n’avons pas reçu votre virement, la réservation sera supprimée automatiquement. <br />
              Voici le RIB de l’agence : <br />
              <strong>RIB :</strong> 001 006 987654321000 12
            </p>
          )}
        </label>

        <label className="block">
          <input
            type="radio"
            name="paymentMethod"
            value="agence"
            checked={paymentMethod === 'agence'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          Paiement en agence
          {paymentMethod === 'agence' && (
            <p className="mt-2 text-sm text-red-600">
              Attention : si le montant n’est pas réglé dans les 48h, votre réservation sera annulée automatiquement. <br />
              Adresse de l’agence : Msaken, Sousse<br />
              Horaires : du lundi au samedi, 08h00 - 17h00
            </p>
          )}
        </label>
      </div>

      <Button type="submit">Continuer</Button>
    </form>
  )
}
