// =====================================
// EXISTING CODE - Keep all your current functions
// =====================================

// Create floating particles
function createParticles() {

    const CartStorage = {
    save: function(cartItems) {
        // Since localStorage is not available, use a global variable
        window.globalCartData = cartItems;
    },
    
    load: function() {
        return window.globalCartData || [];
    },
    
    clear: function() {
        window.globalCartData = [];
    }
};
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 15;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = left + '%';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);
    }
}

// Header scroll effect
function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (!header) return;
        
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Accordion functionality
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const icon = header.querySelector('.accordion-icon');
            
            // Close all other accordions
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherItem.querySelector('.accordion-icon');
                    otherContent.style.display = 'none';
                    otherIcon.textContent = '+';
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current accordion
            if (content.style.display === 'block') {
                content.style.display = 'none';
                icon.textContent = '+';
                item.classList.remove('active');
            } else {
                content.style.display = 'block';
                icon.textContent = '−';
                item.classList.add('active');
            }
        });
    });
}

// =====================================
// ENHANCED CART FUNCTIONALITY - Replace your existing cart function
// =====================================
function initCart() {
    const cartModal = document.getElementById('cart-modal');
    const openCartBtns = document.querySelectorAll('[data-action="open-cart"]');
    const closeCartBtn = document.getElementById('close-cart');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    
    // Cart state management
    let cartItems = [];
    let cartTotal = 0;
    
    // Enhanced cart item structure
    class CartItem {
        constructor(id, name, price, size = 'M', color = '#000000', quantity = 1, image = 'images/default-tshirt.jpg') {
            this.id = id;
            this.name = name;
            this.price = price;
            this.size = size;
            this.color = color;
            this.quantity = quantity;
            this.image = image;
        }
        
        getTotal() {
            return this.price * this.quantity;
        }
    }
    
    // Open cart modal
openCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if we should open modal or redirect to cart page
        if (btn.textContent.trim().toLowerCase().includes('cart')) {
            // If it's the main cart button, redirect to cart.html
            window.location.href = 'cart.html';
        } else {
            // If it's other cart actions, open modal
            if (cartModal) {
                updateCartDisplay();
                cartModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                showLoadingState(cartModal.querySelector('.cart-content'));
                setTimeout(() => hideLoadingState(cartModal.querySelector('.cart-content')), 500);
            }
        }
    });
});
    // Close cart modal
    const closeCart = () => {
        if (cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);
    
    // Close on outside click
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }
    
    // Enhanced add to cart with size and color options
    function addToCart(productData) {
        const existingItem = cartItems.find(item => 
            item.id === productData.id && 
            item.size === productData.size && 
            item.color === productData.color
        );
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push(new CartItem(
                productData.id,
                productData.name,
                productData.price,
                productData.size,
                productData.color,
                1,
                productData.image
            ));
        }
        
        updateCartDisplay();
        updateCartCounter();

        CartStorage.save(cartItems);
    }
    
    // Update cart display
    function updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-items-container');
        if (!cartContainer) return;
        
        cartContainer.innerHTML = '';
        cartTotal = 0;
        
        cartItems.forEach(item => {
            cartTotal += item.getTotal();
            const cartItemElement = createCartItemElement(item);
            cartContainer.appendChild(cartItemElement);
        });
        
        // Update total display
        const totalElement = document.querySelector('.cart-total');
        if (totalElement) {
            totalElement.textContent = `$${cartTotal.toFixed(2)}`;
        }
    }
    
    // Create enhanced cart item element
    function createCartItemElement(item) {
        const div = document.createElement('div');
        div.className = 'cart-item enhanced-cart-item';
        div.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="item-options">
                    <select class="size-selector" data-item-id="${item.id}">
                        <option value="XS" ${item.size === 'XS' ? 'selected' : ''}>XS</option>
                        <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
                        <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
                        <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
                        <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                    </select>
                    <div class="color-selector">
                        <input type="color" value="${item.color}" data-item-id="${item.id}" class="color-picker">
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn minus" data-item-id="${item.id}">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" data-item-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="item-total">$${item.getTotal().toFixed(2)}</span>
                <button class="remove-item" data-item-id="${item.id}">×</button>
            </div>
        `;
        
        // Add event listeners for this item
        addCartItemListeners(div, item);
        
        return div;
    }
    
    // Add event listeners for cart item controls
    function addCartItemListeners(element, item) {
        // Quantity controls
        element.querySelector('.qty-btn.plus').addEventListener('click', () => {
            item.quantity++;
            updateCartDisplay();
            updateCartCounter();
        });
        
        element.querySelector('.qty-btn.minus').addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
                updateCartCounter();
            }
        });
        
        // Size selector
        element.querySelector('.size-selector').addEventListener('change', (e) => {
            item.size = e.target.value;
            updateCartDisplay();
        });
        
        // Color picker
        element.querySelector('.color-picker').addEventListener('change', (e) => {
            item.color = e.target.value;
            updateCartDisplay();
        });
        
        // Remove item
        element.querySelector('.remove-item').addEventListener('click', () => {
            cartItems = cartItems.filter(cartItem => cartItem !== item);
            updateCartDisplay();
            updateCartCounter();
            showToast('Item removed from cart', 'info');
        });
    }
    
    // Update cart counter in header
    function updateCartCounter() {
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }
    
    // Expose addToCart function globally
    window.addToCart = addToCart;
}

// =====================================
// PROFESSIONAL LOADING STATES - NEW FEATURE
// =====================================
function showLoadingState(container) {
    if (!container) return;
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
        <div class="skeleton-content">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `;
    
    container.appendChild(loadingOverlay);
}

function hideLoadingState(container) {
    if (!container) return;
    
    const loadingOverlay = container.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.remove();
            }
        }, 300);
    }
}

// =====================================
// INTERACTIVE PRODUCT GALLERY - NEW FEATURE
// =====================================
function initProductGallery() {
    const galleries = document.querySelectorAll('.product-gallery');
    
    galleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.main-image img');
        const thumbnails = gallery.querySelectorAll('.thumbnail');
        const zoomOverlay = gallery.querySelector('.zoom-overlay');
        
        if (!mainImage || !thumbnails.length) return;
        
        // Thumbnail click handlers
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.src;
                mainImage.alt = thumb.alt;
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                // Add smooth transition
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
            });
        });
        
        // Image zoom functionality
        if (zoomOverlay) {
            mainImage.addEventListener('mouseenter', () => {
                zoomOverlay.style.display = 'block';
            });
            
            mainImage.addEventListener('mouseleave', () => {
                zoomOverlay.style.display = 'none';
            });
            
            mainImage.addEventListener('mousemove', (e) => {
                const rect = mainImage.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                zoomOverlay.style.backgroundImage = `url(${mainImage.src})`;
                zoomOverlay.style.backgroundPosition = `${x}% ${y}%`;
            });
        }
    });
}

// =====================================
// ENHANCED MICRO-ANIMATIONS - NEW FEATURE
// =====================================
function initMicroAnimations() {
    // Enhanced button animations
    document.querySelectorAll('.btn, .cta-button, button').forEach(btn => {
        btn.classList.add('btn-enhanced');
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
        
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(0) scale(0.95)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-2px) scale(1)';
        });
    });
    
    // Card hover animations
    document.querySelectorAll('.feature-card, .testimonial-card, .product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
        });
    });
}

// =====================================
// TRUST BADGES ANIMATION - NEW FEATURE
// =====================================
function initTrustBadges() {
    const trustBadges = document.querySelectorAll('.trust-badge, .security-badge');
    
    trustBadges.forEach((badge, index) => {
        // Stagger animation
        setTimeout(() => {
            badge.classList.add('animate-in');
        }, index * 100);
        
        // Pulse animation on hover
        badge.addEventListener('mouseenter', () => {
            badge.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        badge.addEventListener('animationend', () => {
            badge.style.animation = '';
        });
    });
}

// =====================================
// ENHANCED TOAST SYSTEM - Updated
// =====================================
function showToast(message, type = 'success', duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} enhanced-toast`;
    
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ⓘ'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.success}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        hideToast(toast);
    });
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto hide
    setTimeout(() => {
        hideToast(toast);
    }, duration);
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

// =====================================
// ENHANCED ADD TO CART - Updated existing function
// =====================================
function initAddToCart() {
    const addToCartBtns = document.querySelectorAll('[data-action="add-to-cart"]');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product data from button attributes
            const productData = {
                id: btn.dataset.productId || Date.now().toString(),
                name: btn.dataset.product || 'Custom T-Shirt',
                price: parseFloat(btn.dataset.price) || 29.99,
                size: btn.dataset.size || 'M',
                color: btn.dataset.color || '#000000',
                image: btn.dataset.image || 'images/default-tshirt.jpg'
            };
            
            // Add loading state to button
            const originalText = btn.textContent;
            btn.textContent = 'Adding...';
            btn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                if (window.addToCart) {
                    window.addToCart(productData);
                }
                
                showToast(`${productData.name} added to cart!`, 'success');
                
                // Reset button
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Button success animation
                btn.style.backgroundColor = '#10b981';
                setTimeout(() => {
                    btn.style.backgroundColor = '';
                }, 1000);
                
            }, 500);
            
            // Immediate visual feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// =====================================
// 3D T-SHIRT RENDERER - NEW FEATURE
// =====================================
function init3DTshirt() {
    const container = document.querySelector('.tshirt-model');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'tshirt-canvas';
    container.appendChild(canvas);
    
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create T-shirt geometry
    function createTshirtGeometry() {
        const group = new THREE.Group();
        
        // Main body (using BoxGeometry instead of CapsuleGeometry)
        const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.9, 1.2, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2563eb });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Sleeves
        const sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 6);
        const sleeveMaterial = new THREE.MeshLambertMaterial({ color: 0x2563eb });
        
        const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
        leftSleeve.position.set(-1.1, 0.2, 0);
        leftSleeve.rotation.z = Math.PI / 2;
        leftSleeve.castShadow = true;
        group.add(leftSleeve);
        
        const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
        rightSleeve.position.set(1.1, 0.2, 0);
        rightSleeve.rotation.z = -Math.PI / 2;
        rightSleeve.castShadow = true;
        group.add(rightSleeve);
        
        // Collar
        const collarGeometry = new THREE.RingGeometry(0.4, 0.6, 8);
        const collarMaterial = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(0, 0.6, 0.01);
        collar.castShadow = true;
        group.add(collar);
        
        return group;
    }
    
    const tshirt = createTshirtGeometry();
    scene.add(tshirt);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Camera position
    camera.position.set(0, 0, 3);
    
    // Animation
    let mouseX = 0;
    let mouseY = 0;
    
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth rotation based on mouse
        tshirt.rotation.y += (mouseX * 0.5 - tshirt.rotation.y) * 0.05;
        tshirt.rotation.x += (mouseY * 0.2 - tshirt.rotation.x) * 0.05;
        
        // Auto rotation when not hovering
        if (Math.abs(mouseX) < 0.1 && Math.abs(mouseY) < 0.1) {
            tshirt.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Color controls
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#000000'];
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'tshirt-controls';
    
    colors.forEach(color => {
        const colorControl = document.createElement('div');
        colorControl.className = 'color-control';
        colorControl.style.backgroundColor = color;
        colorControl.addEventListener('click', () => {
            tshirt.children.forEach(child => {
                if (child.material) {
                    child.material.color.setHex(color.replace('#', '0x'));
                }
            });
        });
        controlsDiv.appendChild(colorControl);
    });
    
    container.appendChild(controlsDiv);
    
    // Store reference for cleanup
    container.tshirtRenderer = { scene, renderer, tshirt };
}

// Keep all your existing functions...
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card, .section-title').forEach(el => {
        observer.observe(el);
    });
}

// Newsletter form submission
function initNewsletter() {
    const newsletterForm = document.querySelector('footer form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value) {
                // Add loading state
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showToast('Thank you for subscribing to our newsletter!');
                    emailInput.value = '';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            } else {
                showToast('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.ceil(current) + suffix;
            }
        }, 20);
    });
}

// =====================================
// ENHANCED INITIALIZATION - Updated
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    // Original functions
    createParticles();
    initHeaderScroll();
    initSmoothScrolling();
    initAccordion();
    initMobileMenu();
    initScrollAnimations();
    initNewsletter();

    // Enhanced functions
    initCart(); // This is your enhanced cart system
    initAddToCart(); // Enhanced with loading states
    
    // New professional features
    initProductGallery();
    initMicroAnimations();
    initTrustBadges();
    
    // ADD THIS LINE:
    init3DTshirt();
    
    // Animate counters when hero section is visible
    setTimeout(animateCounters, 1000);
    
    console.log('🎉 Professional enhancements loaded successfully!');
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recreate particles on resize
    const container = document.getElementById('particles');
    if (container) {
        container.innerHTML = '';
        createParticles();
    }

     const tshirtContainer = document.querySelector('.tshirt-model');
    if (tshirtContainer && tshirtContainer.tshirtRenderer) {
        const { renderer } = tshirtContainer.tshirtRenderer;
        renderer.setSize(400, 400);
    }
});

// Enhanced keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close modals on escape
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && cartModal.style.display === 'flex') {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Close any open toasts
        const toasts = document.querySelectorAll('.toast.show');
        toasts.forEach(toast => hideToast(toast));
    }
});