import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

interface Props {
  trigger: React.ReactNode;
}

export function PrivacyPolicyModal({ trigger }: Props) {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('privacy_title')}</DialogTitle>
          <p className="text-xs text-muted-foreground">{t('privacy_updated')}</p>
        </DialogHeader>

        <div className="space-y-5 text-sm leading-relaxed">

          {/* 1. Responsable */}
          <section className="space-y-1">
            <h3 className="font-semibold text-foreground">{t('privacy_section1_title')}</h3>
            <p className="text-muted-foreground">
              <strong>{t('privacy_section1_owner_label')}:</strong> {t('privacy_section1_owner_value')}<br />
              <strong>{t('privacy_section1_activity_label')}:</strong> {t('privacy_section1_activity_value')}<br />
              <strong>{t('privacy_section1_contact_label')}:</strong>{' '}
              <a href="mailto:luprintech@gmail.com" className="text-primary hover:underline">
                luprintech@gmail.com
              </a>
            </p>
          </section>

          <Separator />

          {/* 2. Datos recogidos */}
          <section className="space-y-1">
            <h3 className="font-semibold text-foreground">{t('privacy_section2_title')}</h3>
            <p className="text-muted-foreground">
              {t('privacy_section2_intro')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5 ml-2">
              <li>{t('privacy_section2_item1')}</li>
              <li>{t('privacy_section2_item2')}</li>
              <li>{t('privacy_section2_item3')}</li>
            </ul>
            <p className="text-muted-foreground mt-1">
              {t('privacy_section2_outro')}
            </p>
          </section>

          <Separator />

          {/* 3. Finalidad y legitimación */}
          <section className="space-y-1">
            <h3 className="font-semibold text-foreground">{t('privacy_section3_title')}</h3>
            <div className="text-muted-foreground space-y-1">
              <p>
                <strong>{t('privacy_section3_purpose_label')}:</strong> {t('privacy_section3_purpose_text')}
              </p>
              <p>
                <strong>{t('privacy_section3_legal_label')}:</strong> {t('privacy_section3_legal_text')}
              </p>
            </div>
          </section>

          <Separator />

          {/* 4. Conservación */}
          <section className="space-y-1">
            <h3 className="font-semibold text-foreground">{t('privacy_section4_title')}</h3>
            <p className="text-muted-foreground">
              {t('privacy_section4_text')}{' '}
              <a href="mailto:luprintech@gmail.com" className="text-primary hover:underline">
                luprintech@gmail.com
              </a>.
            </p>
          </section>

          <Separator />

          {/* 5. Destinatarios */}
          <section className="space-y-1">
            <h3 className="font-semibold text-foreground">{t('privacy_section5_title')}</h3>
            <p className="text-muted-foreground">
              {t('privacy_section5_text_prefix')}{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t('privacy_section5_link_text')}
              </a>
              {t('privacy_section5_text_suffix')}
            </p>
          </section>

          <Separator />

          {/* 6. Derechos */}
          <section className="space-y-1">
            <h3 className="font-semibold text-foreground">{t('privacy_section6_title')}</h3>
            <p className="text-muted-foreground">
              {t('privacy_section6_intro')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5 ml-2">
              <li>{t('privacy_section6_item1')}</li>
              <li>{t('privacy_section6_item2')}</li>
              <li>{t('privacy_section6_item3')}</li>
              <li>{t('privacy_section6_item4')}</li>
              <li>{t('privacy_section6_item5')}</li>
            </ul>
            <p className="text-muted-foreground mt-1">
              {t('privacy_section6_outro_prefix')}{' '}
              <a href="mailto:luprintech@gmail.com" className="text-primary hover:underline">
                luprintech@gmail.com
              </a>
              {t('privacy_section6_outro_middle')}{' '}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t('privacy_section6_outro_link_text')}
              </a>
              {t('privacy_section6_outro_suffix')}
            </p>
          </section>

          <Separator />

          {/* 7. Cookies */}
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">{t('privacy_section7_title')}</h3>
            <p className="text-muted-foreground">
              {t('privacy_section7_intro')}
            </p>

            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 font-medium">{t('privacy_table_header_name')}</th>
                    <th className="text-left p-2 font-medium">{t('privacy_table_header_type')}</th>
                    <th className="text-left p-2 font-medium">{t('privacy_table_header_duration')}</th>
                    <th className="text-left p-2 font-medium">{t('privacy_table_header_purpose')}</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t">
                    <td className="p-2 font-mono">connect.sid</td>
                    <td className="p-2">{t('privacy_table_row1_type')}</td>
                    <td className="p-2">{t('privacy_table_row1_duration')}</td>
                    <td className="p-2">{t('privacy_table_row1_purpose')}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-mono">luprintech_cookie_consent</td>
                    <td className="p-2">{t('privacy_table_row2_type')}</td>
                    <td className="p-2">{t('privacy_table_row2_duration')}</td>
                    <td className="p-2">{t('privacy_table_row2_purpose')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground text-xs">
              {t('privacy_section7_footer')}
            </p>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  );
}
