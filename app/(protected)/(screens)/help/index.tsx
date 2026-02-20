import { Linking } from 'react-native';
import styled from '@emotion/native';

const Container = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  padding: 16,
}));

const Section = styled.View({ marginBottom: 24 });

const Question = styled.Text(({ theme }) => ({
  fontSize: 15,
  fontWeight: '600',
  color: theme.colors.text,
  marginBottom: 4,
}));

const Answer = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.colors.textSecondary,
  lineHeight: 20,
}));

const ContactBtn = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  padding: 14,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 8,
}));

const ContactText = styled.Text(({ theme }) => ({
  color: theme.colors.textContrast,
  fontSize: 16,
  fontWeight: '600',
}));

const FAQ = [
  { q: 'How do I list my car?', a: 'Go to your Profile tab and tap "New Listing". Fill in the details and submit. Your listing will be reviewed before going live.' },
  { q: 'How long does review take?', a: 'Listings are typically reviewed within 24 hours.' },
  { q: 'How do I contact a seller?', a: 'Open any car listing and tap "Contact Seller" to start a conversation.' },
  { q: 'Can I edit my listing?', a: 'Currently you can mark a listing as sold or delete it from "My Listings". Full editing is coming soon.' },
  { q: 'Is the app free to use?', a: 'Yes, browsing and listing cars on Gjej Makine is completely free.' },
];

export default function HelpScreen() {
  return (
    <Container>
      {FAQ.map(({ q, a }) => (
        <Section key={q}>
          <Question>{q}</Question>
          <Answer>{a}</Answer>
        </Section>
      ))}
      <ContactBtn onPress={() => Linking.openURL('mailto:support@gjejmakine.al')}>
        <ContactText>Contact Support</ContactText>
      </ContactBtn>
    </Container>
  );
}
