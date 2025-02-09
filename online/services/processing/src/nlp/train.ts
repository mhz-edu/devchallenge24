import { BayesClassifier } from 'natural';

(async () => {
  const categoriesResponse = await fetch(`${process.env.API_URL}/category`);
  const categories = await categoriesResponse.json();

  const clas = new BayesClassifier();
  categories.forEach((category) =>
    category.points.length > 0
      ? clas.addDocument(category.points.join(' '), category.id)
      : null,
  );
  
  clas.train();
  console.log('pretrain done\n');
  clas.save('model.json');
})();
