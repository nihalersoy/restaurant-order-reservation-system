import { PageHeader } from '../components/PageHeader.jsx';
import { useEffect, useState } from 'react';
import { menuApi } from '../services/api.js';
import { addCartItem } from '../utils/cartStorage.js';

const categories = ['', 'APPETIZER', 'MAIN_COURSE', 'SIDE', 'DESSERT', 'DRINK'];

export function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      setIsLoading(true);
      setError('');

      try {
        const response = category
          ? await menuApi.getByCategory(category)
          : await menuApi.getAll();

        if (isMounted) {
          setMenuItems(response);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, [category]);

  function handleAddToCart(menuItem) {
    addCartItem(menuItem);
    setSuccess(`${menuItem.name} added to cart.`);
  }

  return (
    <>
      <PageHeader
        title="Menu"
        description="Browse restaurant dishes and add items to your cart."
      />
      <section className="toolbar">
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item || 'ALL'} value={item}>
                {item || 'All'}
              </option>
            ))}
          </select>
        </label>
      </section>

      {error ? <p className="message error">{error}</p> : null}
      {success ? <p className="message success">{success}</p> : null}
      {isLoading ? <p className="muted">Loading menu...</p> : null}

      <section className="grid-list">
        {menuItems.map((item) => (
          <article className="item-card" key={item.id}>
            <div>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
            <div className="item-meta">
              <span>{item.category}</span>
              <strong>£{Number(item.price).toFixed(2)}</strong>
            </div>
            <button
              className="primary-button"
              type="button"
              disabled={!item.available}
              onClick={() => handleAddToCart(item)}
            >
              {item.available ? 'Add to cart' : 'Unavailable'}
            </button>
          </article>
        ))}
      </section>
    </>
  );
}
