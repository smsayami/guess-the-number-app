import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 100;

// Picks a random integer between min and max, inclusive.
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function App() {
  // Range configuration, editable before the game starts.
  const [minInput, setMinInput] = useState(String(DEFAULT_MIN));
  const [maxInput, setMaxInput] = useState(String(DEFAULT_MAX));
  const [range, setRange] = useState({ min: DEFAULT_MIN, max: DEFAULT_MAX });
  const [rangeError, setRangeError] = useState('');

  const [target, setTarget] = useState(() => randomInRange(DEFAULT_MIN, DEFAULT_MAX));
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);

  // Starts a new round using the currently confirmed range.
  function startNewGame(newRange = range) {
    setTarget(randomInRange(newRange.min, newRange.max));
    setGuess('');
    setFeedback('');
    setAttempts(0);
    setWon(false);
  }

  // Validates and applies a new min/max range, then restarts the game.
  function applyRange() {
    const min = parseInt(minInput, 10);
    const max = parseInt(maxInput, 10);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      setRangeError('Please enter valid numbers for both min and max.');
      return;
    }
    if (min >= max) {
      setRangeError('Min must be less than max.');
      return;
    }

    setRangeError('');
    const newRange = { min, max };
    setRange(newRange);
    startNewGame(newRange);
  }

  function handleGuess() {
    if (won) return;

    const guessNumber = parseInt(guess, 10);
    if (Number.isNaN(guessNumber)) {
      setFeedback('Please enter a valid number.');
      return;
    }

    setAttempts((prev) => prev + 1);

    if (guessNumber === target) {
      setFeedback('Correct!');
      setWon(true);
    } else if (guessNumber < target) {
      setFeedback('Higher');
    } else {
      setFeedback('Lower');
    }

    setGuess('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Guess The Number</Text>
        <Text style={styles.subtitle}>
          I'm thinking of a number between {range.min} and {range.max}.
        </Text>

        {/* Optional range configuration */}
        <View style={styles.rangeRow}>
          <TextInput
            style={styles.rangeInput}
            keyboardType="number-pad"
            value={minInput}
            onChangeText={setMinInput}
            placeholder="Min"
          />
          <Text style={styles.rangeSeparator}>to</Text>
          <TextInput
            style={styles.rangeInput}
            keyboardType="number-pad"
            value={maxInput}
            onChangeText={setMaxInput}
            placeholder="Max"
          />
          <Pressable style={styles.smallButton} onPress={applyRange}>
            <Text style={styles.smallButtonText}>Set Range</Text>
          </Pressable>
        </View>
        {!!rangeError && <Text style={styles.errorText}>{rangeError}</Text>}

        <View style={styles.card}>
          <TextInput
            style={styles.guessInput}
            keyboardType="number-pad"
            value={guess}
            onChangeText={setGuess}
            placeholder="Your guess"
            editable={!won}
            onSubmitEditing={handleGuess}
          />

          <Pressable
            style={[styles.button, won && styles.buttonDisabled]}
            onPress={handleGuess}
            disabled={won}
          >
            <Text style={styles.buttonText}>Guess</Text>
          </Pressable>

          {!!feedback && (
            <Text style={[styles.feedback, won && styles.feedbackWin]}>{feedback}</Text>
          )}

          <Text style={styles.attempts}>Attempts: {attempts}</Text>

          {won && (
            <Pressable style={styles.playAgainButton} onPress={() => startNewGame()}>
              <Text style={styles.buttonText}>Play Again</Text>
            </Pressable>
          )}

          {!won && (
            <Pressable style={styles.resetButton} onPress={() => startNewGame()}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          )}
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 60,
    padding: 8,
    textAlign: 'center',
  },
  rangeSeparator: {
    marginHorizontal: 8,
    color: '#555',
  },
  smallButton: {
    marginLeft: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  smallButtonText: {
    fontSize: 12,
    color: '#333',
  },
  errorText: {
    color: '#c0392b',
    marginBottom: 12,
    fontSize: 12,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    marginTop: 16,
  },
  guessInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 160,
    padding: 12,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2e86de',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedback: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  feedbackWin: {
    color: '#27ae60',
  },
  attempts: {
    fontSize: 14,
    color: '#555',
    marginTop: 12,
  },
  playAgainButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 20,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetButtonText: {
    color: '#888',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
