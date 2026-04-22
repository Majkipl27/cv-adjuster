import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';
import type { Cv } from '@/lib/schema';

const NOTO_SERIF = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSerif';

Font.register({
  family: 'Noto Serif',
  fonts: [
    { src: `${NOTO_SERIF}/NotoSerif-Regular.ttf` },
    { src: `${NOTO_SERIF}/NotoSerif-Italic.ttf`, fontStyle: 'italic' },
    { src: `${NOTO_SERIF}/NotoSerif-Bold.ttf`, fontWeight: 700 },
    { src: `${NOTO_SERIF}/NotoSerif-BoldItalic.ttf`, fontWeight: 700, fontStyle: 'italic' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Serif',
    fontSize: 10.5,
    lineHeight: 1.35,
    color: '#111',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
  },
  header: { textAlign: 'center', marginBottom: 8 },
  name: { fontSize: 22, fontWeight: 700, letterSpacing: 1 },
  title: { fontSize: 11, fontStyle: 'italic', color: '#333', marginTop: 12 },
  contact: { fontSize: 9.5, color: '#333', marginTop: 4 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    borderBottom: '1pt solid #111',
    paddingBottom: 1,
    marginTop: 10,
    marginBottom: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  rowLeft: { fontWeight: 700 },
  rowRight: { fontStyle: 'italic', color: '#555' },
  italic: { fontStyle: 'italic' },
  entry: { marginBottom: 6 },
  bulletRow: { flexDirection: 'row', marginTop: 1 },
  bulletDot: { width: 10, textAlign: 'center' },
  bulletText: { flex: 1 },
  skillLine: { marginBottom: 1 },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((b, i) => (
        <View style={styles.bulletRow} key={i}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

export function CvPdfDocument({ cv }: { cv: Cv }) {
  const contactParts = [
    cv.personal.location,
    cv.personal.email,
    cv.personal.phone,
    cv.personal.links?.linkedin,
    cv.personal.links?.github,
    cv.personal.links?.portfolio,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cv.personal.name}</Text>
          {cv.personal.title ? <Text style={styles.title}>{cv.personal.title}</Text> : null}
          {contactParts.length > 0 ? (
            <Text style={styles.contact}>{contactParts.join('  ·  ')}</Text>
          ) : null}
        </View>

        {cv.summary ? (
          <View>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{cv.summary}</Text>
          </View>
        ) : null}

        {cv.education.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {cv.education.map((e, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.rowLeft}>{e.school}</Text>
                  <Text style={styles.rowRight}>
                    {e.startDate ? `${e.startDate} – ${e.endDate}` : e.endDate}
                  </Text>
                </View>
                <Text style={styles.italic}>{e.degree}</Text>
                {e.notes ? <Text>{e.notes}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {cv.experience.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {cv.experience.map((e, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.rowLeft}>{e.company}</Text>
                  <Text style={styles.rowRight}>
                    {e.startDate} – {e.endDate}
                  </Text>
                </View>
                <Text style={styles.italic}>
                  {e.role}
                  {e.location ? `, ${e.location}` : ''}
                </Text>
                <Bullets items={e.bullets} />
              </View>
            ))}
          </View>
        ) : null}

        {cv.projects.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {cv.projects.map((p, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.rowLeft}>{p.name}</Text>
                  {p.url ? <Text style={styles.rowRight}>{p.url}</Text> : null}
                </View>
                <Text>{p.description}</Text>
                {p.bullets && p.bullets.length > 0 ? <Bullets items={p.bullets} /> : null}
              </View>
            ))}
          </View>
        ) : null}

        {cv.skills.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            {cv.skills.map((s, i) => (
              <Text key={i} style={styles.skillLine}>
                <Text style={styles.rowLeft}>{s.category}: </Text>
                {s.items.join(', ')}
              </Text>
            ))}
          </View>
        ) : null}

        {cv.achievements.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Bullets items={cv.achievements} />
          </View>
        ) : null}

        {cv.languages.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text>
              {cv.languages.map((l, i) => (
                <Text key={i}>
                  <Text style={styles.rowLeft}>{l.name}</Text>
                  <Text> - {l.level}</Text>
                  {i < cv.languages.length - 1 ? '  ·  ' : ''}
                </Text>
              ))}
            </Text>
          </View>
        ) : null}

        {cv.volunteer && cv.volunteer.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Volunteer Experience</Text>
            {cv.volunteer.map((v, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.rowLeft}>{v.organization}</Text>
                  <Text style={styles.rowRight}>
                    {v.startDate} – {v.endDate}
                  </Text>
                </View>
                <Text style={styles.italic}>{v.role}</Text>
                <Bullets items={v.bullets} />
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export async function downloadCvPdf(cv: Cv) {
  const blob = await pdf(<CvPdfDocument cv={cv} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (cv.personal.name || 'cv').replace(/[^a-z0-9]+/gi, '_');
  a.download = `${safeName}_CV.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
