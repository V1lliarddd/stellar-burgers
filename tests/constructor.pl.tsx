import { test, expect } from '@playwright/test';

test('Отображение ингридиентов', async ({ page }) => {
  await page.routeFromHAR('./tests/har-files/ingredients.har', {
    url: '**/api/ingredients',
    notFound: 'abort'
  });

  await page.goto('/');
  await expect(
    page.getByText('Краторная булка N-200i') &&
      page.getByText('Флюоресцентная булка R2-D3')
  ).toBeVisible();
});

test('Добавление ингридиентов', async ({ page }) => {
  await page.routeFromHAR('./tests/har-files/ingredients.har', {
    url: '**/api/ingredients',
    notFound: 'abort'
  });

  await page.goto('/');
  //Добавим первую булку
  await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

  const bun = page
    .getByTestId('ingredient-element')
    .filter({ hasText: 'Краторная булка N-200i' });

  await bun.getByRole('button', { name: 'Добавить' }).click();

  const topBun = await page
    .getByTestId('constructor-element-bottom')
    .textContent();
  const bottomBun = await page
    .getByTestId('constructor-element-bottom')
    .textContent();

  await expect(bottomBun).toContain('Краторная булка N-200i');
  await expect(topBun).toContain('Краторная булка N-200i');

  await expect(
    page.getByText('Биокотлета из марсианской Магнолии')
  ).toBeVisible();

  const ingredient = page
    .getByTestId('ingredient-element')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

  await ingredient.getByRole('button', { name: 'Добавить' }).click();
  await expect(
    page
      .getByTestId('constructor-element')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
  );

  await expect(page.getByText('Соус Spicy-X')).toBeVisible();

  const sauce = page
    .getByTestId('ingredient-element')
    .filter({ hasText: 'Соус Spicy-X' });

  await sauce.getByRole('button', { name: 'Добавить' }).click();
  await expect(
    page.getByTestId('constructor-element').filter({ hasText: 'Соус Spicy-X' })
  );
});

test('Функционал модального окна', async ({ page }) => {
  await page.routeFromHAR('./tests/har-files/ingredients.har', {
    url: '**/api/ingredients',
    notFound: 'abort'
  });

  await page.goto('/');
  await expect(
    page.getByText('Краторная булка N-200i') &&
      page.getByText('Флюоресцентная булка R2-D3')
  ).toBeVisible();

  const ingredient = page
    .getByTestId('ingredient-element')
    .filter({ hasText: 'Краторная булка N-200i' });

  await ingredient.getByRole('link').click();
  await expect(page.getByTestId('modal')).toBeVisible();

  await page.getByTestId('modal-close').click();
  await expect(page.getByTestId('modal')).not.toBeVisible();

  await ingredient.getByRole('link').click();
  await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
  await expect(page.getByTestId('modal')).not.toBeVisible();

  await ingredient.getByRole('link').click();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('Функционал создания заказа', async ({ page, context }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'refreshToken',
      '452603ca6bfce25e661e17d419a4d81f9b486b5921e4ed0a32a49581cfc82073fd65c5abf403d6c2'
    );
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value:
        'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTAwNjZiNmExNzJkMDAxYjk5NDc1YyIsImlhdCI6MTc4ODg3ODkzNywiZXhwIjoxNzg4ODgwMTM3fQ.ZhF7ri7RL2FVlpcHZBITHUVb_des5gN57SH4m4icSTU',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.routeFromHAR('./tests/har-files/ingredients.har', {
    url: '**/api/ingredients',
    notFound: 'abort'
  });

  await page.routeFromHAR('./tests/har-files/user.har', {
    url: '**/api/auth/user',
    notFound: 'abort'
  });

  await page.routeFromHAR('./tests/har-files/order.har', {
    url: '**/api/orders',
    notFound: 'abort'
  });

  await page.goto('/');
  await expect(page.getByText('test-user')).toBeVisible();

  const bun = page
    .getByTestId('ingredient-element')
    .filter({ hasText: 'Краторная булка N-200i' });
  await bun.getByRole('button', { name: 'Добавить' }).click();
  const ingredient = page
    .getByTestId('ingredient-element')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
  await ingredient.getByRole('button', { name: 'Добавить' }).click();
  await page.getByText('Оформить заказ').click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('order-number')).toBeVisible({
    timeout: 20000
  });

  await page.getByTestId('modal-close').click();
  await expect(page.getByTestId('modal')).not.toBeVisible();

  await expect(page.getByTestId('constructor-element-bottom')).toHaveText(
    'Выберите булки'
  );
  await expect(page.getByTestId('constructor-element-top')).toHaveText(
    'Выберите булки'
  );
  await expect(page.getByTestId('constructor-element')).toHaveText(
    'Выберите начинку'
  );

  await context.clearCookies();
});
