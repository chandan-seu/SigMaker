import React from 'react';
import { SignatureData, SectionId } from '../types';

interface Props {
  data: SignatureData;
  isExport?: boolean;
}

export const SignatureTable: React.FC<Props> = ({ data, isExport = false }) => {
  const {
    sections,
    enabledSections,
    fontFamily,
    globalSpacing,
    globalAlign,
  } = data;

  const renderSection = (id: SectionId) => {
    if (!enabledSections[id]) return null;

    switch (id) {
      case 'profile':
        if (!data.profileImage) return null;
        return (
          <tr key={id}>
            <td align={data.profileAlign} style={{ paddingBottom: `${globalSpacing}px` }}>
              <img
                src={data.profileImage}
                alt="Profile"
                width={data.profileSize}
                style={{
                  display: 'block',
                  width: `${data.profileSize}px`,
                  borderRadius: `${data.profileRadius}%`,
                }}
              />
            </td>
          </tr>
        );

      case 'name-title':
        if (!data.fullName && !data.jobTitle) return null;
        return (
          <tr key={id}>
            <td align={globalAlign} style={{ paddingBottom: `${globalSpacing}px` }}>
              <div style={{ 
                fontFamily, 
                fontSize: `${data.nameSize}px`, 
                fontWeight: 'bold', 
                color: data.nameColor,
                lineHeight: '1.2'
              }}>
                {data.fullName}
              </div>
              <div style={{ 
                fontFamily, 
                fontSize: `${data.titleSize}px`, 
                color: data.titleColor,
                lineHeight: '1.4'
              }}>
                {data.jobTitle}
              </div>
            </td>
          </tr>
        );

      case 'company':
        if (!data.companyName && !data.companyLogo) return null;
        return (
          <tr key={id}>
            <td align={globalAlign} style={{ paddingBottom: `${globalSpacing}px` }}>
              {data.companyLogo && (
                <img
                  src={data.companyLogo}
                  alt="Logo"
                  width={data.logoSize}
                  style={{
                    display: 'block',
                    width: `${data.logoSize}px`,
                    borderRadius: `${data.logoRadius}px`,
                    marginBottom: '4px'
                  }}
                />
              )}
              <div style={{ 
                fontFamily, 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: data.companyColor 
              }}>
                {data.companyName}
              </div>
            </td>
          </tr>
        );

      case 'contact':
        const hasPhones = data.phones.some(p => p);
        const hasEmails = data.emails.some(e => e);
        const hasWebsites = data.websites.some(w => w);
        if (!hasPhones && !hasEmails && !hasWebsites) return null;
        
        return (
          <tr key={id}>
            <td align={globalAlign} style={{ paddingBottom: `${globalSpacing}px` }}>
              <table cellPadding="0" cellSpacing="0" border={0}>
                <tbody>
                  {data.phones.map((phone, idx) => phone && (
                    <tr key={`phone-${idx}`}>
                      <td style={{ fontFamily, fontSize: '13px', color: data.contactColor, paddingBottom: '2px' }}>
                        <a href={`tel:${phone}`} style={{ color: data.contactColor, textDecoration: 'none' }}>{phone}</a>
                      </td>
                    </tr>
                  ))}
                  {data.emails.map((email, idx) => email && (
                    <tr key={`email-${idx}`}>
                      <td style={{ fontFamily, fontSize: '13px', color: data.contactColor, paddingBottom: '2px' }}>
                        <a href={`mailto:${email}`} style={{ color: data.contactColor, textDecoration: 'none' }}>{email}</a>
                      </td>
                    </tr>
                  ))}
                  {data.websites.map((website, idx) => website && (
                    <tr key={`website-${idx}`}>
                      <td style={{ fontFamily, fontSize: '13px', color: data.contactColor, paddingBottom: (idx === data.websites.length - 1) ? '0' : '2px' }}>
                        <a href={`https://${website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: data.contactColor, textDecoration: 'none' }}>{website}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        );

      case 'social':
        const enabledLinks = data.socialLinks.filter(l => l.enabled && l.url);
        if (enabledLinks.length === 0) return null;
        return (
          <tr key={id}>
            <td align={data.socialAlign} style={{ paddingBottom: `${globalSpacing}px` }}>
              <table cellPadding="0" cellSpacing="0" border={0}>
                <tbody>
                  <tr>
                    {enabledLinks.map((link, idx) => (
                      <td key={link.id} style={{ paddingRight: idx === enabledLinks.length - 1 ? '0' : '8px' }}>
                        <a href={link.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                          <img
                            src={`https://cdn-icons-png.flaticon.com/512/${
                              link.platform === 'facebook' ? '733/733547' :
                              link.platform === 'linkedin' ? '3536/3536505' :
                              link.platform === 'whatsapp' ? '733/733585' :
                              '2111/2111463' // Instagram
                            }.png`}
                            alt={link.platform}
                            width={data.socialIconSize}
                            height={data.socialIconSize}
                            style={{
                              display: 'block',
                              width: `${data.socialIconSize}px`,
                              height: `${data.socialIconSize}px`,
                              filter: data.socialIconColor === '#000000' ? 'none' : 'grayscale(100%)' // Simple color simulation
                            }}
                          />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        );

      case 'trustpilot':
        if (!data.trustpilotBadge) return null;
        return (
          <tr key={id}>
            <td align={globalAlign} style={{ paddingBottom: `${globalSpacing}px` }}>
              <a href={data.trustpilotUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <img
                  src={data.trustpilotBadge}
                  alt="Trustpilot"
                  width={data.trustpilotSize}
                  style={{
                    display: 'block',
                    width: `${data.trustpilotSize}px`,
                  }}
                />
              </a>
            </td>
          </tr>
        );

      case 'custom-text':
        if (!data.customText) return null;
        return (
          <tr key={id}>
            <td align={globalAlign} style={{ paddingBottom: `${globalSpacing}px` }}>
              <div style={{ 
                fontFamily, 
                fontSize: `${data.customTextSize}px`, 
                color: data.customTextColor,
                whiteSpace: 'pre-wrap'
              }}>
                {data.customText}
              </div>
            </td>
          </tr>
        );

      default:
        return null;
    }
  };

  return (
    <table 
      cellPadding="0" 
      cellSpacing="0" 
      border={0} 
      style={{ 
        fontFamily, 
        lineHeight: '1.4',
        borderCollapse: 'collapse'
      }}
    >
      <tbody>
        {sections.map(renderSection)}
      </tbody>
    </table>
  );
};
