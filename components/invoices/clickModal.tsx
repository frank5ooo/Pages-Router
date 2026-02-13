import { formatCurrency } from '@/components/utils/utils';
import { useMemo } from 'react';
import { Remarkable } from 'remarkable';

const md = new Remarkable();

type Props = {
  markdown?: { name: string; price: number }[];
};

export default function MarkdownPreview({ markdown }: Props) {
  const product = useMemo(() => {
    const items = Array.isArray(markdown) ? markdown : [];

    if (items.length === 0) return "No hay productos registrados.";

    return items
      .map(p => `- ${p.name}: ${formatCurrency(Number(p.price))}`)
      .join('\n');
  }, [markdown]);

  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{ __html: md.render(product ?? '') }}
    />
  );
}
