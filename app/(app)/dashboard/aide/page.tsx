'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Video,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react'

const helpTopics = [
  {
    icon: BookOpen,
    title: 'Guide de démarrage',
    description: 'Apprenez les bases de FlowCommerce en 5 minutes',
    href: '#',
  },
  {
    icon: Video,
    title: 'Tutoriels vidéo',
    description: 'Regardez nos tutoriels pas à pas',
    href: '#',
  },
  {
    icon: MessageCircle,
    title: 'FAQ',
    description: 'Trouvez des réponses aux questions courantes',
    href: '#',
  },
]

const faqItems = [
  {
    question: 'Comment ajouter un nouveau produit ?',
    answer: 'Rendez-vous dans la section "Produits" et cliquez sur le bouton "Nouveau produit" en haut à droite.',
  },
  {
    question: 'Comment exporter mes ventes ?',
    answer: 'Dans la section "Rapports", vous trouverez un bouton d\'export pour télécharger vos données en CSV ou PDF.',
  },
  {
    question: 'Puis-je utiliser FlowCommerce hors-ligne ?',
    answer: 'Oui, FlowCommerce fonctionne en mode hors-ligne. Les données seront synchronisées automatiquement quand vous serez de nouveau connecté.',
  },
  {
    question: 'Comment ajouter un employé ?',
    answer: 'Allez dans Paramètres > Équipe et cliquez sur "Inviter un collaborateur".',
  },
]

export default function AidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Aide & Support</h2>
        <p className="text-zinc-500">
          Trouvez de l&apos;aide et contactez notre équipe de support.
        </p>
      </div>

      {/* Help topics */}
      <div className="grid gap-4 md:grid-cols-3">
        {helpTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <Card key={topic.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-sm text-zinc-500">{topic.description}</p>
                  <Button variant="link" className="text-blue-600">
                    Accéder <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
          <CardDescription>Les réponses aux questions les plus posées</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="p-4 bg-zinc-50 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">{item.question}</h4>
                  <p className="text-sm text-zinc-600">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contactez-nous</CardTitle>
            <CardDescription>Notre équipe est là pour vous aider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:support@flowcommerce.fr" className="text-sm text-blue-600 hover:underline">
                  support@flowcommerce.fr
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium">Téléphone</p>
                <a href="tel:+33123456789" className="text-sm text-blue-600 hover:underline">
                  01 23 45 67 89
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envoyez un message</CardTitle>
            <CardDescription>Nous vous répondrons dans les 24h</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sujet</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre sujet..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Décrivez votre problème..."
              />
            </div>
            <Button className="w-full">Envoyer</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
