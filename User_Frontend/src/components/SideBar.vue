<script>
</script>

<template>

  <!-- navbackground -> background-image: url('img/navBar_bg.png'); -->
  <div style="background-color: #FFFFFF; height: 100px; border-radius: 0px 0px 0px 70px; margin-bottom: 20px;">

    <nav class="navbar" aria-label="Light offcanvas navbar">

      <div class="container-fluid">

        <!-- Sidebar 展開按鈕 -->
        <div class="d-flex m-3">
          <a data-bs-toggle="offcanvas" href="#offcanvasNavbarLight" aria-controls="offcanvasNavbarLight">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" class="bi bi-layout-sidebar"
                viewBox="0 0 16 16" fill="#4A4A4A">
                <path
                  d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z" />
              </svg>
            </div>
          </a>

          <!-- 台中通logo -->
          <img src="/img/logo.svg" alt="Logo" style="height: 40px; margin-left: 15px;" />
          <!-- <h4 style="margin-left: 15px; color: aliceblue;">Happy Lion</h4> -->
        </div>


        <!-- 會員登入頭像和下拉選單 -->
        <!-- 
                    <div class="d-flex align-items-center" style="margin-right: 15px;">
                    <div class="dropdown">
                        <a class="d-flex align-items-center text-gray text-decoration-none dropdown-toggle"
                            id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                             假設這裡是會員頭像
                            <img src="https://picsum.photos/id/684/600/400" alt="user-avatar" width="40" height="40"
                                class="rounded-circle border" style="border-width: 8px; ">

                            <h5 style="margin-left: 10px; color: #4A4A4A;">Jocelyn</h5>
                        </a>


                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="#">會員資訊</a></li>
                            <li><a class="dropdown-item" href="#">會員</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">登出</a></li>
                        </ul>
                    </div>
                </div>
                 -->


        <!-- 登入註冊 -->
        <div class="col-md-3 text-end" style="margin-right: 20px;">
          <!-- 登入和註冊按鈕（在大於 576px 時顯示） -->
          <div class="d-none d-sm-block">
            <button type="button" class="btn btn-outline-primary me-2" data-bs-toggle="modal"
              data-bs-target="#loginModal">
              登入
            </button>
            <RouterLink to="/registerView" type="button" class="btn btn-primary">註冊</RouterLink>
          </div>

          <!-- 漢堡選單（在小於 576px 時顯示） -->
          <div class="d-block d-sm-none">
            <button class="btn btn-outline-primary" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#4A4A4A" class="bi bi-list"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
              </svg>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#loginModal">登入</a>
              </li>
              <li>
                <RouterLink to="/registerView" class="dropdown-item">註冊</RouterLink>
              </li>
            </ul>
          </div>
        </div>


        <!-- SideBar 收起按鈕 -->
        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbarLight"
          aria-labelledby="offcanvasNavbarLightLabel" style="width: 220px ; border-radius: 0px 50px 0px 0px;">

          <div class="offcanvas-header m-2">

            <a type="button" data-bs-dismiss="offcanvas" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#4A4A4A"
                class="bi bi-layout-sidebar-inset" viewBox="0 0 16 16">
                <path
                  d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" />
                <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
              </svg>
            </a>

          </div>
          <hr style="margin: 10px;">


          <!-- SideBar 選單 -->

          <div class="offcanvas-body" style="background-color: #FFFFFF;">

            <div class="fs-5">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3" style="margin-left: 30px;">

                <li class="nav-item">
                  <RouterLink to="/" class="nav-link" aria-current="page" style="color: #4A4A4A;">

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                      <path
                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                    台中通
                  </RouterLink>
                </li>

                <li class="nav-item">
                  <RouterLink to="/StoreSetView" class="nav-link" style="color: #4A4A4A;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                      <path
                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                    場地租借
                  </RouterLink>
                </li>

                <li class="nav-item">
                  <RouterLink to="/StoreSetView" class="nav-link" style="color: #4A4A4A;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                      <path
                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                    活動資訊
                  </RouterLink>
                </li>


                <li class="nav-item">
                  <RouterLink to="/StoreSetView" class="nav-link" style="color: #4A4A4A;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                      <path
                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                    常見問題
                  </RouterLink>
                </li>
              </ul>
            </div>


          </div>

          <!-- SideBar Logo -->
          <div>
            <img src="/img/logo.svg" alt="Logo"
              style="height: 44px; position: fixed; bottom: 30px; margin-left: 48px;" />
          </div>

        </div>
      </div>

    </nav>

  </div>

  <RouterView />
</template>

<style>
/* 使用者頭像與名稱對齊 */
.user-avatar-container {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.user-avatar-container img {
  margin-right: 10px;
}

.text-gray {
  color: #4a4a4a;
}

.btn-outline-primary {
  --bs-btn-border-color: #ffffff;
  color: #000000;
  --bs-btn-hover-bg: #0074a9;
  --bs-btn-active-bg: #0074a9;
  --bs-btn-active-border-color: #0074a9;
}

.btn-primary {
  background-color: #019ee7;
  border-color: #019ee7;
  --bs-btn-hover-bg: #0074a9;
  --bs-btn-active-bg: #0074a9;
  --bs-btn-active-border-color: #0074a9;
}
</style>