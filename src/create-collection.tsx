import { ErrorBoundary } from './components/ErrorBoundary';
import { CollectionForm } from './components/forms/CollectionForm';

export default function Command() {
  return (
    <ErrorBoundary>
      <CollectionForm />
    </ErrorBoundary>
  );
}
