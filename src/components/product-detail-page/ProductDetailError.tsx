type ProductDetailErrorProps = {
  error: string;
};

const ProductDetailError = ({ error }: ProductDetailErrorProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    </div>
  );
}

export default ProductDetailError;